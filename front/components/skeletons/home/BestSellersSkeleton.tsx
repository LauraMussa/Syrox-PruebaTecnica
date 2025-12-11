import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BestSellersSkeleton() {
  return (
    <Card className="h-full border border-transparent shadow-sm bg-card flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 border-b border-border/50 last:border-0 last:pb-0">
            <Skeleton className="h-10 w-10 rounded-md shrink-0" />
            
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            
            <div className="flex flex-col items-end gap-1">
              {i < 3 && <Skeleton className="h-2 w-4" />}
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
