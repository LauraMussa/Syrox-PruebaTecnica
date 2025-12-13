"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHistory } from "@/store/history/historySlice";

export function HistoryDropdown() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.history);
  const [open, setOpen] = useState(false);
  const [dot, setDot] = useState(false);
  useEffect(() => {
    dispatch(fetchHistory());

    const interval = setInterval(() => {
      if (!open) {
        dispatch(fetchHistory());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, open]);

  useEffect(() => {
    if (items.length > 0) {
      const latestItemId = items[0].id;
      const lastSeenId = localStorage.getItem("lastSeenAuditId");

      if (!open && latestItemId !== lastSeenId) {
        setDot(true);
      } else {
        setDot(false);
      }
    }
  }, [items, open]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      if (items.length > 0) {
        localStorage.setItem("lastSeenAuditId", items[0].id);
        setDot(false);
      }
      dispatch(fetchHistory());
    }
  };
  const recentItems = items.slice(0, 5);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon" className="relative">
          <History className="h-5 w-5 text-muted-foreground" />
          {dot && (
            <span className="absolute top-2 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-background " />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Actividad Reciente</h4>
          <span className="text-xs text-muted-foreground">Últimos 5 eventos</span>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="flex flex-col">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentItems.length > 0 ? (
              recentItems.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-1 px-4 py-3 border-b hover:bg-muted/50 transition-colors text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-primary truncate max-w-[180px]">
                      {log.action.replace(/_/g, " ")} {/* Quita guiones bajos */}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs">{log.description}</p>
                  <span className="text-[10px] text-blue-500 font-medium">
                    {log.user?.email || "Sistema"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">No hay actividad reciente.</div>
            )}
          </div>
        </ScrollArea>

        <div className="p-2 border-t bg-muted/20">
          <Link href="/admin/history" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-center text-xs h-8">
              Ver historial completo
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
