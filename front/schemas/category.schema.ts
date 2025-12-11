import * as z from "zod";
export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  position: z.coerce.number().min(0, "La posición debe ser 0 o mayor"),
  parentId: z.string().nullable().optional(), // Puede ser null o string vacío
});