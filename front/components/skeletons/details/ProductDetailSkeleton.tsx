import { Skeleton } from "@/components/ui/skeleton";
export function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen animate-in fade-in">
     
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> 
          <Skeleton className="h-4 w-48" /> 
        </div>
        <Skeleton className="h-10 w-24" /> 
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-24 mb-4" /> 
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>

          <div className="border rounded-xl p-6 space-y-6">
            <Skeleton className="h-6 w-24" /> 
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> 
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" /> 
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-24" /> 
            <div className="space-y-4 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-8" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-24" /> 
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="col-span-2 space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-6 space-y-4">
            <Skeleton className="h-6 w-24" /> 
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
