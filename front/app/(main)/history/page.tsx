"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Search,
  PlusCircle,
  Trash2,
  Edit,
  LogIn,
  LogOut,
  Activity,
  ArrowUpDown,
  StopCircle,
  ShieldMinus,
} from "lucide-react";

// Shadcn Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHistory } from "@/store/history/historySlice";
import { HistorySkeleton } from "@/components/skeletons/history/HistorySkeleton";

// Helper para iconos y colores según la acción
const getActionConfig = (action: string) => {
  const upperAction = action.toUpperCase();
  if (upperAction.includes("CREAR"))
    return { icon: PlusCircle, color: "text-green-600", badge: "bg-green-100 text-green-800" };
  if (upperAction.includes("ELIMINAR"))
    return { icon: Trash2, color: "text-red-600", badge: "bg-red-100 text-red-800" };
  if (upperAction.includes("ACTUALIZAR") || upperAction.includes("EDITAR"))
    return { icon: Edit, color: "text-blue-600", badge: "bg-blue-100 text-blue-800" };
  if (upperAction.includes("DESACTIVAR") || upperAction.includes("DESACTIVAR"))
    return { icon: ShieldMinus, color: "text-amber-600", badge: "bg-amber-100 text-amber-700" };

  if (upperAction.includes("LOGIN"))
    return { icon: LogIn, color: "text-purple-600", badge: "bg-purple-100 text-purple-800" };
  if (upperAction.includes("LOGOUT"))
    return { icon: LogOut, color: "text-gray-600", badge: "bg-gray-100 text-gray-800" };
  return { icon: Activity, color: "text-slate-600", badge: "bg-slate-100 text-slate-800" };
};

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.history);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const filteredItems = items.filter(
    (item) =>
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-72" />
        </div>
        <HistorySkeleton />
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Actividad</h1>
          <p className="text-muted-foreground">Registro completo de eventos del sistema.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuario, acción..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Eventos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((log) => {
                      const config = getActionConfig(log.action);
                      const Icon = config.icon;

                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className={`p-2 rounded-md w-fit ${config.badge.split(" ")[0]}`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{log.action.replace(/_/g, " ")}</TableCell>
                          <TableCell
                            className="text-muted-foreground max-w-[300px] truncate"
                            title={log.description}
                          >
                            {log.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{log.user?.email || "Sistema"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap text-muted-foreground text-xs">
                            {format(new Date(log.createdAt), "PPP p", { locale: es })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
