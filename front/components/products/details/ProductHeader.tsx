import { ArrowLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";

export function ProductHeader({ product, onEdit }: { product: Product; onEdit: () => void }) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Button className="cursor-pointer " variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 " />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="font-mono text-xs">ID: {product.id.slice(0, 8)}...</span>
            <span>•</span>
            <span>Creado el {format(new Date(product.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
          </div>
        </div>
      </div>
      <Button variant="outline" className="cursor-pointer" onClick={onEdit}>
        <Edit className="h-4 w-4 mr-2" /> Editar
      </Button>
    </div>
  );
}
