import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductListSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-10 w-10 rounded" />
          </TableCell>
          
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </TableCell>
          
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          
          {/* Marca (Texto corto) */}
          <TableCell>
            <Skeleton className="h-4 w-[60px]" />
          </TableCell>
          
          {/* Stock (Badge ancho) */}
          <TableCell>
            <Skeleton className="h-5 w-20" />
          </TableCell>
          
          {/* Estado/Switch (Ancho pequeño) */}
          <TableCell>
            <Skeleton className="h-5 w-[60px]" />
          </TableCell>
          
          {/* Acciones (Botones a la derecha) */}
          <TableCell>
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
