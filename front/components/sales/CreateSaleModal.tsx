"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createSale } from "@/store/sales/salesSlice";
import { fetchCustomers } from "@/store/customers/customerSlice";
import { fetchPagProducts } from "@/store/products/productsSlice"; // Y esto
import { CreateSaleDto } from "@/types/sale.types";
import { Product } from "@/types/product.types";
import { Customer } from "@/types/customer.types";
import { toast } from "sonner";
import { Plus, Trash2, ShoppingCart, User, CreditCard, X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export function CreateSaleModal({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();

  // Selectores para llenar los selects
  const { items: customers } = useAppSelector((state: any) => state.customers || { items: [] });
  const { items: products } = useAppSelector((state: any) => state.products.paginated || { items: [] });

  // Estados del formulario
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  // Estado del "Carrito"
  const [cart, setCart] = useState<CartItem[]>([]);

  // Estado para agregar producto individual
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Cargar datos al abrir (si es necesario)
  useEffect(() => {
    if (open) {
      dispatch(fetchCustomers());
      dispatch(fetchPagProducts({ page: 1, limit: 100 }));
    }
  }, [open, dispatch]);

  const handleAddProduct = () => {
    if (!selectedProductId) return;

    const product = products.find((p: Product) => p.id === selectedProductId);
    if (!product) return;

    const existingItemIndex = cart.findIndex((item) => item.productId === selectedProductId);

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: quantity,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      toast.error("Selecciona un cliente");
      return;
    }
    if (cart.length === 0) {
      toast.error("Agrega al menos un producto");
      return;
    }

    const payload: CreateSaleDto = {
      customerId: selectedCustomerId,
      paymentMethod: paymentMethod,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      status: "PENDING",
      paymentStatus: "PENDING",
    };

    try {
      await dispatch(createSale(payload)).unwrap();
      toast.success("Venta creada exitosamente");
      onOpenChange(false);

      setCart([]);
      setSelectedCustomerId("");
      setPaymentMethod("CASH");
    } catch (error) {
      toast.error("Error al crear la venta");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Pedido</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" /> Cliente
              </Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c: Customer) => (
                    <SelectItem value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Método de Pago
              </Label>
              <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                  <SelectItem value="CARD">Tarjeta</SelectItem>
                  <SelectItem value="TRANSFER">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* SECCIÓN 2: AGREGAR PRODUCTOS */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Productos
            </Label>

            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar producto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p: Product) => (
                      <SelectItem key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} - ${p.price} (Stock: {p.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-24 space-y-2">
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>

              <Button onClick={handleAddProduct} disabled={!selectedProductId}>
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>

            {/* TABLA CARRITO */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Cant.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                        No hay productos en el pedido
                      </TableCell>
                    </TableRow>
                  ) : (
                    cart.map((item, index) => (
                      <TableRow key={`${item.productId}-${index}`}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">${item.price}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.price * item.quantity}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* TOTAL */}
            <div className="flex justify-end items-center gap-4 pt-2">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${calculateTotal()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={cart.length === 0 || !selectedCustomerId}>
            Confirmar Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
