
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSaleById, createSale, updateSaleStatus, resetSelectedSale } from "@/store/sales/salesSlice";
import { fetchProducts } from "@/store/products/productsSlice";
import { fetchCustomers, addCustomer } from "@/store/customers/customerSlice";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSaleFormSchema, SaleFormValues, updateSaleSchema } from "@/schemas/saleForm.schema";
import { OrderStatus } from "@/types/sale.types";

// --- IMPORTACIÓN DE SECCIONES (Asegúrate de tener los archivos creados) ---
import { SaleCustomerSection } from "./form-sections/SaleCustomerSection";
import { SaleProductsSection } from "./form-sections/SaleProductsSection";
import { SaleSummarySection } from "./form-sections/SaleSummarySection";
import { SaleNotesSection } from "./form-sections/SaleNotesSection";
import { SaleActionsSection } from "./form-sections/SaleActionsSection";

interface SaleFormProps {
  saleId?: string;
}

export function SaleForm({ saleId }: SaleFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isNew = !saleId;
  const schema = isNew ? createSaleFormSchema : updateSaleSchema;

  // Redux Selectors
  const { selectedSale, loadingSelected } = useAppSelector((state) => state.sales);
  const customers = useAppSelector((state) => state.customers.items);
  const products = useAppSelector((state) =>
    state.products.items.filter((p) => p.stock > 0 && p.isActive == true)
  );
  const { user } = useAppSelector((state) => state.auth);

  // Local State
  const [currentUserDetails, setCurrentUserDetails] = useState({
    address: "",
    phone: "",
    name: user?.name || "",
  });

  // Effect: Actualizar nombre si carga tarde desde Redux
  useEffect(() => {
    if (user?.name) {
      setCurrentUserDetails((prev) => ({ ...prev, name: user.name || "" }));
    }
  }, [user]);

  // React Hook Form Setup
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerId: "",
      paymentMethod: "EFECTIVO",
      note: "",
      items: [],
      status: "PENDING",
      trackingId: "",
    },
  });

  // Effects: Carga Inicial
  useEffect(() => {
    if (isNew) {
      dispatch(resetSelectedSale());
      dispatch(fetchCustomers());
      dispatch(fetchProducts());
    } else if (saleId) {
      dispatch(fetchSaleById(saleId));
    }
  }, [saleId, isNew, dispatch]);

  // Effects: Rellenar formulario en Edición
  useEffect(() => {
    if (!isNew && selectedSale) {
      form.reset({
        status: selectedSale.status,
        trackingId: selectedSale.trackingId || "",
        note: selectedSale.note || "",
      });
    }
  }, [selectedSale, isNew, form]);

  const onSubmit = async (data: SaleFormValues) => {
    try {
      let finalCustomerId = data.customerId;

      if (finalCustomerId === "CURRENT_USER") {
        if (!user) {
          toast.error("No se pudo identificar al usuario actual");
          return;
        }
        if (!currentUserDetails.address || !currentUserDetails.phone || !currentUserDetails.name) {
          toast.error("Por favor completa nombre, dirección y teléfono");
          return;
        }

        const existingCustomer = customers.find((c) => c.email === user.email);

        if (existingCustomer) {
          finalCustomerId = existingCustomer.id;
        } else {
          try {
            const newCustomerAction = await dispatch(
              addCustomer({
                name: currentUserDetails.name,
                email: user.email,
                address: currentUserDetails.address,
                phone: currentUserDetails.phone,
              })
            ).unwrap();

            finalCustomerId = newCustomerAction.id;
            toast.success("Cliente registrado correctamente");
          } catch (createError: any) {
            console.error("Fallo al crear cliente:", createError);
            toast.error(`Error creando cliente: ${createError}`);
            return;
          }
        }
      }

      if (isNew) {
        const payloadItems = data.items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        }));

        await dispatch(
          createSale({
            customerId: finalCustomerId,
            paymentMethod: data.paymentMethod,
            note: data.note,
            items: payloadItems,
          })
        ).unwrap();

        toast.success("Venta creada exitosamente");
      } else {
        if (!saleId) return;

        await dispatch(
          updateSaleStatus({
            id: saleId,
            status: data.status as OrderStatus,
            trackingId: data.status === "SHIPPED" ? data.trackingId : undefined,
            note: data.note,
          })
        ).unwrap();

        toast.success("Venta actualizada exitosamente");
      }
      router.push("/sales");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Error al guardar la venta");
    }
  };

  if (loadingSelected && !isNew) return <div className="p-10 text-center">Cargando datos...</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto p-4 md:p-6 pb-24 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild type="button" className="h-10 w-10">
              <Link href="/sales">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isNew ? "Nueva Venta" : `Orden #${selectedSale?.orderNumber}`}
              </h1>
              <p className="text-muted-foreground">
                {isNew
                  ? "Complete los detalles para registrar una venta."
                  : "Gestione el estado de la orden actual."}
              </p>
            </div>
          </div>
        </div>

        {isNew && (
          <SaleCustomerSection
            customers={customers}
            user={user}
            currentUserDetails={currentUserDetails}
            setCurrentUserDetails={setCurrentUserDetails}
          />
        )}

        {isNew ? (
          <SaleProductsSection products={products} />
        ) : (
          <SaleSummarySection selectedSale={selectedSale} />
        )}

        <SaleNotesSection isReadOnly={!isNew} />

        <SaleActionsSection isNew={isNew} isSubmitting={form.formState.isSubmitting} />
      </form>
    </Form>
  );
}
