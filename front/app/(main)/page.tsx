import InventoryCard from "@/components/home/InventoryCard";
import LastestSales from "@/components/home/LastestSales";
import BestSellers from "@/components/home/BestSellers";

export default function DashboardPage() {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <InventoryCard />

      <LastestSales />

      <BestSellers />
    </div>
  );
}
