import { Customer } from "@/types/customer.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

interface Props {
  customer: Customer;
}

export function CustomerCard({ customer }: Props) {
  const initials = customer.name.substring(0, 2).toUpperCase();

  return (
    <Card className="hover:shadow-lg transition-all hover:border-primary/50 bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold text-lg truncate text-foreground" title={customer.name}>
            {customer.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
             Registrado el {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 text-sm pt-2">
        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate" title={customer.email}>{customer.email}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{customer.phone || "Sin teléfono"}</span>
        </div>

        <div className="flex items-start gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="truncate line-clamp-2 text-xs" title={customer.address}>
            {customer.address || "Sin dirección"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-3 border-t bg-muted/20 dark:bg-muted/10 flex justify-between items-center">
        <Badge variant="secondary" className="gap-1 font-normal bg-secondary hover:bg-secondary/80 text-secondary-foreground">
          <ShoppingBag className="h-3 w-3" />
          {customer._count?.sales || 0} Compras
        </Badge>
        <Button variant="ghost" size="sm" className="text-xs h-8 hover:bg-primary/10 hover:text-primary">
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
