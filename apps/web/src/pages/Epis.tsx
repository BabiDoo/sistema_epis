import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Loader2, Package, Plus, Search, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

type EpiForm = {
  tipoEpiId: number;
  dataCompra: string;
  periodoVencimentoMeses: number;
  quantidade: number;
};

export default function Epis() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [epiForm, setEpiForm] = useState<EpiForm>({
    tipoEpiId: 0,
    dataCompra: new Date().toISOString().split('T')[0],
    periodoVencimentoMeses: 12,
    quantidade: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const { data: tiposEpi } = trpc.tiposEpi.list.useQuery();
  const { data: epis, isLoading, refetch } = trpc.epis.list.useQuery();

  const createBatch = trpc.epis.createBatch.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.quantidade} EPIs cadastrados com sucesso! SKUs gerados automaticamente.`);
      setIsDialogOpen(false);
      setEpiForm({
        tipoEpiId: 0,
        dataCompra: new Date().toISOString().split('T')[0],
        periodoVencimentoMeses: 12,
        quantidade: 1,
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar EPIs: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epiForm.tipoEpiId) {
      toast.error("Selecione um tipo de EPI");
      return;
    }

    createBatch.mutate({
      tipoEpiId: epiForm.tipoEpiId,
      dataCompra: new Date(epiForm.dataCompra),
      periodoVencimentoMeses: epiForm.periodoVencimentoMeses,
      quantidade: epiForm.quantidade,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      disponivel: { label: "Disponível", variant: "default" as const },
      em_uso: { label: "Em Uso", variant: "secondary" as const },
      vencido: { label: "Vencido", variant: "destructive" as const },
      descartado: { label: "Descartado", variant: "outline" as const },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.disponivel;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredEpis = epis?.filter((epi) => {
    const matchesSearch = 
      epi.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || epi.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="h-6 w-6" />
                  Gerenciamento de EPIs
                </CardTitle>
                <CardDescription>
                  Cadastre EPIs em lote com geração automática de SKU
                </CardDescription>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar EPIs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="em_uso">Em Uso</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Tipo de EPI</TableHead>
                    <TableHead>Data de Compra</TableHead>
                    <TableHead>Data de Validade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEpis && filteredEpis.length > 0 ? (
                    filteredEpis.map((epi) => (
                      <TableRow key={epi.id}>
                        <TableCell className="font-mono font-medium">{epi.sku}</TableCell>
                        <TableCell>{epi.tipoEpiId}</TableCell>
                        <TableCell>{format(new Date(epi.dataCompra), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {format(new Date(epi.dataValidade), 'dd/MM/yyyy')}
                            {new Date(epi.dataValidade) < new Date() && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(epi.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum EPI encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cadastrar EPIs em Lote</DialogTitle>
            <DialogDescription>
              Informe a quantidade e o sistema gerará um SKU único para cada EPI automaticamente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="tipoEpiId">Tipo de EPI *</Label>
                <Select
                  value={epiForm.tipoEpiId ? String(epiForm.tipoEpiId) : ""}
                  onValueChange={(value) =>
                    setEpiForm((prev) => ({ ...prev, tipoEpiId: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de EPI" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposEpi && tiposEpi.length > 0 ? (
                      tiposEpi.map((tipo) => (
                        <SelectItem key={tipo.id} value={String(tipo.id)}>
                          {tipo.nome} - {tipo.categoria}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Nenhum tipo de EPI cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dataCompra">Data da Compra *</Label>
                <Input
                  id="dataCompra"
                  type="date"
                  value={epiForm.dataCompra}
                  onChange={(e) =>
                    setEpiForm((prev) => ({ ...prev, dataCompra: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="periodoVencimentoMeses">Período de Vencimento (meses) *</Label>
                <Input
                  id="periodoVencimentoMeses"
                  type="number"
                  min="1"
                  value={epiForm.periodoVencimentoMeses}
                  onChange={(e) =>
                    setEpiForm((prev) => ({
                      ...prev,
                      periodoVencimentoMeses: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="quantidade">Quantidade Comprada *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  max="1000"
                  value={epiForm.quantidade}
                  onChange={(e) =>
                    setEpiForm((prev) => ({ ...prev, quantidade: parseInt(e.target.value) }))
                  }
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Será gerado um SKU único para cada unidade (ex: EPI-2024-00001, EPI-2024-00002, ...)
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Resumo do Cadastro</h4>
              <ul className="text-sm space-y-1">
                <li>• Quantidade de EPIs: <strong>{epiForm.quantidade}</strong></li>
                <li>• Data de compra: <strong>{format(new Date(epiForm.dataCompra), 'dd/MM/yyyy')}</strong></li>
                <li>
                  • Data de validade: <strong>
                    {format(
                      new Date(new Date(epiForm.dataCompra).setMonth(
                        new Date(epiForm.dataCompra).getMonth() + epiForm.periodoVencimentoMeses
                      )),
                      'dd/MM/yyyy'
                    )}
                  </strong>
                </li>
                <li>• Status inicial: <strong>Disponível</strong></li>
              </ul>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createBatch.isPending}>
                {createBatch.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando {epiForm.quantidade} EPIs...
                  </>
                ) : (
                  `Cadastrar ${epiForm.quantidade} EPI${epiForm.quantidade > 1 ? 's' : ''}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
