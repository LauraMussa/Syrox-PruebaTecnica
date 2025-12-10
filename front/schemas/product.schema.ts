import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción es muy corta"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El precio debe ser un número positivo",
  }),
  stock: z.coerce.number().min(0, "Stock inválido"), 
  brand: z.string().min(1, "Marca requerida"),
  gender: z.enum(["Niños", "Hombre", "Mujer", "Unisex"]),
  categoryId: z.string().min(1, "Categoría requerida"),
  isActive: z.boolean().default(true), // .default() lo hace opcional en el input pero obligatorio en el output
});
export type ProductFormValues = z.infer<typeof productSchema>;
