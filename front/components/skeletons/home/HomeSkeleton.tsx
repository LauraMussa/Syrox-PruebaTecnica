import { InventoryCardSkeleton } from "./InventoryCardSkeleton";
import { LatestSalesSkeleton } from "./LatestSalesSkeleton";
import { BestSellersSkeleton } from "./BestSellersSkeleton";

export function HomeSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
  
      <div className="h-full">
        <InventoryCardSkeleton />
      </div>
      <div className="h-full">
        <LatestSalesSkeleton />
      </div>
      <div className="h-full">
        <BestSellersSkeleton />
      </div>
    </div>
  );
}
