import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SaleDetailSkeleton() {
  return (
    <div className="p-6 space-y-6 w-full max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
             <Skeleton className="h-5 w-5" /> {/* Flecha */}
             <Skeleton className="h-8 w-48" /> {/* Título Orden */}
             <Skeleton className="h-6 w-24" /> {/* Badge */}
           </div>
          <Skeleton className="h-4 w-32 ml-8" /> {/* Fecha */}
        </div>
        <div className="flex gap-2 ml-8 md:ml-0">
          <Skeleton className="h-9 w-40" /> 
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna izquierda*/}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" /> {/* Título Productos */}
            </CardHeader>
            <CardContent>
              {/* Fake Table Header */}
              <div className="flex justify-between mb-4 px-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-8">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div className="space-y-2 w-1/3">
                      <Skeleton className="h-5 w-3/4" /> {/* Nombre prod */}
                      <Skeleton className="h-3 w-1/2" /> {/* Desc prod */}
                    </div>
                    <div className="flex gap-8 items-center">
                      <Skeleton className="h-4 w-16" /> {/* Precio */}
                      <Skeleton className="h-4 w-8" />  {/* Cant */}
                      <Skeleton className="h-5 w-20" /> {/* Total */}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-end gap-2 pt-6 border-t mt-4">
                 <div className="w-full max-w-[250px] space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                 <div className="flex gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                 </div>
                 <Skeleton className="h-4 w-24 ml-6" />
              </div>
            </CardContent>
          </Card>

          {/* Pago*/}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20 rounded-full" /> {/* Badge estado */}
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
