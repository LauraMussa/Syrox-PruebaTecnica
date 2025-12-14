import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";

interface SaleCustomerSectionProps {
  customers: any[];
  user: any;
  currentUserDetails: any;
  setCurrentUserDetails: (val: any) => void;
}

export function SaleCustomerSection({ customers, user, currentUserDetails, setCurrentUserDetails }: SaleCustomerSectionProps) {
  const form = useFormContext(); // Hook clave para acceder al form padre

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Package className="w-5 h-5" />
          </div>
          <CardTitle>Cliente</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar Cliente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 p-6 text-base cursor-pointer">
                    <SelectValue placeholder="Buscar cliente..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {user && (
                    <SelectItem value="CURRENT_USER" className="font-semibold text-primary bg-primary/5">
                      <div className="flex flex-col items-start">
                        <span className="font-medium"> Yo ({user.name})</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </SelectItem>
                  )}
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("customerId") === "CURRENT_USER" && (
          <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-muted/30 rounded-lg border border-dashed">
             
             <div className="space-y-2">
                <FormLabel>Dirección de Envío *</FormLabel>
                <Input
                  value={currentUserDetails.address}
                  onChange={(e) => setCurrentUserDetails((prev: any) => ({ ...prev, address: e.target.value }))}
                  required
                />
             </div>
             <div className="space-y-2">
                <FormLabel>Teléfono *</FormLabel>
                <Input
                  value={currentUserDetails.phone}
                  onChange={(e) => setCurrentUserDetails((prev: any) => ({ ...prev, phone: e.target.value }))}
                  required
                />
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
