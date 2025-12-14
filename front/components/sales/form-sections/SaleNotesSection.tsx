import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface SaleNotesSectionProps {
  isReadOnly?: boolean; 
}

export function SaleNotesSection({ isReadOnly = false }: SaleNotesSectionProps) {
  const form = useFormContext();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>Observaciones</CardTitle>
        <CardDescription>
          Información adicional para el equipo de despacho o contabilidad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {isReadOnly ? (
                  
                  <div className="p-4 rounded-md bg-muted/30 border text-sm italic min-h-[80px]">
                    {field.value || "Sin observaciones registradas."}
                  </div>
                ) : (
                  
                  <Textarea
                    {...field}
                    placeholder="Escribe aquí cualquier detalle importante (ej: horario de entrega, referencia de domicilio...)"
                    className="min-h-[100px] resize-none bg-background focus:bg-background"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
