import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function SalesListSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </TableCell>

          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-24 rounded" />
          </TableCell>

          <TableCell>
             <div className="space-y-1">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-3 w-12 ml-auto" />
             </div>
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-20 rounded" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-8 w-16 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
