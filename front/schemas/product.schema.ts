import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción es muy corta"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  brand: z.string().min(1, "Marca requerida"),
  gender: z.enum(["Niños", "Hombre", "Mujer", "Unisex"]),
  options: z
    .object({
      color: z.array(z.string()).min(1, "Al menos un color es requerido"),
      talla: z.array(z.string().or(z.number())).min(1, "Al menos un talle es requerido"),
    }),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  categoryId: z.string().min(1, "Categoría requerida"),
  isActive: z.boolean().default(true), 
});
export type ProductFormValues = z.infer<typeof productSchema>;
