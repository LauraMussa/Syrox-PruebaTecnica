import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/product.types";

export function ProductSidebar({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      {/* Estado y Precios */}
      <Card>
        <CardHeader><CardTitle className="text-base">Inventario</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-500" : ""}>
              {product.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Stock</span>
            <span className="text-xl font-bold">{product.stock}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Precio</span>
            <span className="text-xl font-bold">${Number(product.price).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Taxonomía */}
      <Card>
        <CardHeader><CardTitle className="text-base">Clasificación</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><span className="text-xs text-muted-foreground block">Categoría</span><p className="font-medium text-sm">{product.category?.name}</p></div>
          <div><span className="text-xs text-muted-foreground block">Género</span><p className="font-medium text-sm">{product.gender}</p></div>
          <div><span className="text-xs text-muted-foreground block">Marca</span><p className="font-medium text-sm">{product.brand}</p></div>
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4"/> Historial</CardTitle></CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div className="flex justify-between"><span>Creado:</span><span>{format(new Date(product.createdAt), "dd/MM/yy HH:mm")}</span></div>
          <div className="flex justify-between"><span>Editado:</span><span>{format(new Date(product.updatedAt), "dd/MM/yy HH:mm")}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
