import { z } from "zod";

export const createSaleFormSchema = z.object({
  customerId: z.string().min(1, "Debes seleccionar un cliente"),
  paymentMethod: z.string().min(1, "Selecciona método de pago"),
  note: z.string().optional(),
  status: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Selecciona un producto"),
        quantity: z.number().min(1, "Mínimo 1 unidad"),
        maxStock: z.number().optional(),
      })
    )
    .refine((items) => items.length > 0, {
      message: "Debes agregar al menos un producto",
    })
    .superRefine((items, ctx) => {
      items.forEach((item, index) => {
        if (item.maxStock !== undefined && item.quantity > item.maxStock) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Stock insuficiente (Máx: ${item.maxStock})`,
            path: [index, "quantity"],
          });
        }
      });
    }),
  trackingId: z.string(),
});

export const updateSaleSchema = z.object({
  // Campos de Create que ignoramos (los hacemos opcionales o any)
  customerId: z.any().optional(),
  paymentMethod: z.any().optional(),
  items: z.any().optional(),
  
  note: z.string().optional(),
  status: z.string().min(1, "El estado es requerido"),
  trackingId: z.string().optional(),
}).superRefine((data, ctx) => {
  if ((data.status === "SHIPPED" ) && !data.trackingId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El número de tracking es obligatorio para envíos",
      path: ["trackingId"],
    });
  }
});


export type SaleFormValues = z.infer<typeof createSaleFormSchema>; 
