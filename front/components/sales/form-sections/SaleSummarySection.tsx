import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Sale } from "@/types/sale.types"; 

interface SaleSummarySectionProps {
  selectedSale: Sale | null;
}

export function SaleSummarySection({ selectedSale }: SaleSummarySectionProps) {
  if (!selectedSale) return null;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4 bg-muted/10 border-b">
        <CardTitle>Resumen de Compra</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {selectedSale.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded border overflow-hidden relative shrink-0">
                  <Image
                    src={item.product.images?.[0] || "/placeholder.png"}
                    fill
                    alt={item.product.name}
                    className="object-contain p-1"
                  />
                </div>
                
                <div className="flex flex-col">
                  <span className="font-semibold text-sm md:text-base">{item.product.name}</span>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span>{item.quantity} {item.quantity === 1 ? "unidad" : "unidades"}</span>
                    <span>x</span>
                    <span>${Number(item.price).toFixed(2)}</span>
                  </div>
                  {/* Si tienes variantes (color/talle) guardadas, podrías mostrarlas aquí */}
                  {/* <span className="text-[10px] text-muted-foreground">Talle: M - Color: Rojo</span> */}
                </div>
              </div>
              
              <p className="font-bold text-sm md:text-base">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="flex justify-between items-center pt-6 mt-4 border-t border-dashed">
            <div className="flex flex-col">
              <span className="text-lg font-medium">Total Pagado</span>
              <span className="text-xs text-muted-foreground">Incluye impuestos si aplica</span>
            </div>
            <span className="text-3xl font-bold text-primary tracking-tight">
              ${Number(selectedSale.total).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
