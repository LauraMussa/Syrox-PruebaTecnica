import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  isLoading: boolean;
  totalItems: number;
  itemName?: string;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ 
  currentPage, 
  lastPage, 
  isLoading, 
  totalItems,
  itemName = "registros",
  onPageChange 
}: PaginationControlsProps) {
  
  const itemsPerPage = 10;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(start + itemsPerPage - 1, totalItems);

  return (
    <div className="flex items-center justify-between p-4 border-t bg-muted/20">
      <div className="text-xs text-muted-foreground hidden sm:block">
        Mostrando <b>{totalItems > 0 ? start : 0}-{end}</b> de <b>{totalItems}</b> {itemName}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage || isLoading}
        >
          Siguiente <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
