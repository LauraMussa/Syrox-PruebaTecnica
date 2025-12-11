import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryCardSkeleton() {
  return (
    <Card className="h-full flex border border-transparent flex-col shadow-sm bg-card overflow-hidden">

      <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
        <div className="flex gap-2 items-center">
           <Skeleton className="w-5 h-5 rounded" /> 
           <Skeleton className="h-4 w-24" /> 
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        
        <div>
          <Skeleton className="h-9 w-16 mb-1" /> 
          <Skeleton className="h-3 w-32 mb-1" /> 
          <Skeleton className="h-4 w-40 mt-1" /> 
        </div>

        <div className="flex-1 overflow-hidden pr-2 -mr-2">
          <div className="flex flex-col gap-1">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <Skeleton className="h-3 w-3/4" /> 
                <Skeleton className="h-3 w-12" />  
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-5 sm:gap-2 mt-auto pt-2 justify-between">
           <Skeleton className="h-8 w-32 rounded-sm" /> 
           <Skeleton className="h-8 w-24 rounded-sm ml-auto" /> 
        </div>

      </CardContent>
    </Card>
  );
}
