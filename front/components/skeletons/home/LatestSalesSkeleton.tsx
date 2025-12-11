import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LatestSalesSkeleton() {
  return (
    <Card className="h-full border border-transparent shadow-sm bg-card flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center gap-2">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </CardHeader>

      <CardContent className="flex-1 px-4 pb-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-3 bg-background space-y-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-32" /> {/* Nombre */}
              <Skeleton className="h-4 w-20" /> {/* Precio */}
            </div>
            <div className="flex justify-between items-center pt-1">
               <div className="space-y-1">
                  <Skeleton className="h-3 w-24" /> {/* Order # */}
                  <Skeleton className="h-2 w-16" /> {/* Status */}
               </div>
               <Skeleton className="h-2 w-16" /> {/* Fecha */}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
