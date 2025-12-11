import { Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product.types";

export function ProductInfoCards({ product }: { product: Product }) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Galería */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> Galería
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-lg border overflow-hidden bg-muted relative group">
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50 text-muted-foreground">
              Sin imágenes
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info y Variantes */}
      <Card>
        <CardHeader><CardTitle>Detalles</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Descripción</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">{product.description || "Sin descripción."}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Colores</h3>
              <div className="flex flex-wrap gap-2">
                {(product.options?.color as string[])?.map((c, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1">{c}</Badge>
                )) || <span className="text-sm italic text-muted-foreground">N/A</span>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Talles</h3>
              <div className="flex flex-wrap gap-2">
                {(product.options?.talla as any[])?.map((t, i) => (
                  <div key={i} className="h-8 w-8 flex items-center justify-center rounded border bg-muted text-xs font-medium">{t}</div>
                )) || <span className="text-sm italic text-muted-foreground">N/A</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
