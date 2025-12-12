import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreditCard, Truck, Save, Loader2 } from "lucide-react";

interface SaleActionsSectionProps {
  isNew: boolean;
  isSubmitting: boolean;
}

export function SaleActionsSection({ isNew, isSubmitting }: SaleActionsSectionProps) {
  const form = useFormContext();
  const status = form.watch("status"); // Observamos el estado para mostrar/ocultar tracking

  return (
    <Card className="border-2 border-primary/20 shadow-md bg-muted/10">
      <CardHeader className="pb-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary text-primary-foreground rounded-full">
            {isNew ? <CreditCard className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
          </div>
          <CardTitle>{isNew ? "Finalizar Venta" : "Actualizar Estado"}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6 bg-background rounded-b-lg">
    
        {!isNew && (
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del Pedido</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="PREPARING">En Preparación</SelectItem>
                      <SelectItem value="SHIPPED">Enviado</SelectItem>
                      <SelectItem value="DELIVERED">Entregado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status === "SHIPPED" && (
              <FormField
                control={form.control}
                name="trackingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Seguimiento</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Ej: MX-99887766" 
                        className="h-12 bg-background" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        {isNew && (
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Método de Pago</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    <SelectItem value="TARJETA">Tarjeta de Crédito/Débito</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferencia Bancaria</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Separator className="my-4" />

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg h-12 shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isSubmitting ? "Procesando..." : isNew ? "Confirmar Venta" : "Guardar Cambios"}
        </Button>
      </CardContent>
    </Card>
  );
}
