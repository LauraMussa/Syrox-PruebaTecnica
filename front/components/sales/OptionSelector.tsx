import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function OptiontSelector({ product, onVariantSelected }: { product: any, onVariantSelected: (id: string, stock: number) => void }) {
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");

  const availableColors = product?.options?.color || product?.options?.colores || [];
  const availableSizes = product?.options?.talla || product?.options?.tallas || [];

  useEffect(() => {
    if (!product?.variants) return;
    
    const variant = product.variants.find((v: any) => 
      (!availableColors.length || v.color === color) && 
      (!availableSizes.length || v.size === size)
    );

    if (variant && (color || !availableColors.length) && (size || !availableSizes.length)) {
       onVariantSelected(variant.id, variant.stock);
    } else {
       onVariantSelected("", 0);
    }
  }, [color, size, product, onVariantSelected, availableColors, availableSizes]);

  if (!product?.options) return null;

  return (
    <div className="flex gap-4 w-full">
      {availableColors.length > 0 && (
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Color</label>
          <Select onValueChange={setColor} value={color}>
            <SelectTrigger className="h-12 cursor-pointer">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {availableColors.map((c: string) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {availableSizes.length > 0 && (
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Talle</label>
          <Select onValueChange={setSize} value={size}>
            <SelectTrigger className="h-12 cursor-pointer">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {availableSizes.map((t: string) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
