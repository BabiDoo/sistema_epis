import { useAuth } from "@/_core/hooks/useAuth";
import SignatureCanvas from "@/components/SignatureCanvas";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRightLeft, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

type MovimentacaoForm = {
  epiId: number;
  colaboradorId: number;
  tipo: "entrega" | "emprestimo" | "devolucao" | "substituicao" | "perda" | "dano";
  motivo: string;
  dataMovimentacao: string;
  observacoes: string;
  assinaturaUrl: string;
};

export default function Movimentacoes() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [movimentacaoForm, setMovimentacaoForm] = useState<MovimentacaoForm>({
    epiId: 0,
    colaboradorId: 0,
    tipo: "entrega",
    motivo: "",
    dataMovimentacao: new Date().toISOString().split("T")[0],
    observacoes: "",
    assinaturaUrl: "",
  });

  const { data: colaboradores } = trpc.colaboradores.list.useQuery();
  const { data: episDisponiveis } = trpc.epis.list.useQuery();
  const { data: movimentacoes, isLoading, refetch } = trpc.movimentacoes.list.useQuery();

  const createMovimentacao = trpc.movimentacoes.create.useMutation({
    onSuccess: () => {
      toast.success("Movimentação registrada com sucesso!");
      setIsDialogOpen(false);
      setShowSignature(false);
      setMovimentacaoForm({
        epiId: 0,
        colaboradorId: 0,
        tipo: "entrega",
        motivo: "",
        dataMovimentacao: new Date().toISOString().split("T")[0],
        observacoes: "",
        assinaturaUrl: "",
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao registrar movimentação: ${error.message}`);
    },
  });

  const handleSaveSignature = (signature: string) => {
    setMovimentacaoForm((prev) => ({ ...prev, assinaturaUrl: signature }));
    setShowSignature(false);
    toast.success("Assinatura capturada com sucesso!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movimentacaoForm.epiId || !movimentacaoForm.colaboradorId) {
      toast.error("Selecione um EPI e um colaborador");
      return;
    }

    if (!movimentacaoForm.assinaturaUrl) {
      toast.error("Assinatura é obrigatória");
      return;
    }

    createMovimentacao.mutate({
      epiId: movimentacaoForm.epiId,
      colaboradorId: movimentacaoForm.colaboradorId,
      tipo: movimentacaoForm.tipo,
      motivo: movimentacaoForm.motivo || undefined,
      dataMovimentacao: new Date(movimentacaoForm.dataMovimentacao),
      observacoes: movimentacaoForm.observacoes || undefined,
      assinaturaUrl: movimentacaoForm.assinaturaUrl,
    });
  };

  const getTipoBadge = (tipo: string) => {
    const tipoMap = {
      entrega: { label: "Entrega", variant: "default" as const },
      emprestimo: { label: "Empréstimo", variant: "secondary" as const },
      devolucao: { label: "Devolução", variant: "outline" as const },
      substituicao: { label: "Substituição", variant: "default" as const },
      perda: { label: "Perda", variant: "destructive" as const },
      dano: { label: "Dano", variant: "destructive" as const },
    };
    const config = tipoMap[tipo as keyof typeof tipoMap] || tipoMap.entrega;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
                  <ArrowRightLeft className="h-6 w-6" />
                  Movimentações de EPIs
                </CardTitle>
                <CardDescription>
                  Registre entregas, empréstimos, devoluções e outras movimentações
                </CardDescription>
              </div>
              {(user?.role === "admin" || user?.role === "almoxarife") && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Movimentação
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>EPI (SKU)</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Assinatura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoes && movimentacoes.length > 0 ? (
                    movimentacoes.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell>{format(new Date(mov.dataMovimentacao), "dd/MM/yyyy HH:mm")}</TableCell>
                        <TableCell>{getTipoBadge(mov.tipo)}</TableCell>
                        <TableCell className="font-mono">{mov.epiId}</TableCell>
                        <TableCell>{mov.colaboradorId}</TableCell>
                        <TableCell className="max-w-xs truncate">{mov.motivo || "-"}</TableCell>
                        <TableCell>
                          {mov.assinaturaUrl ? (
                            <img
                              src={mov.assinaturaUrl}
                              alt="Assinatura"
                              className="h-8 w-20 object-contain border rounded"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma movimentação registrada
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Movimentação de EPI</DialogTitle>
            <DialogDescription>
              Preencha os dados da movimentação e colete a assinatura do colaborador
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de Movimentação *</Label>
                <Select
                  value={movimentacaoForm.tipo}
                  onValueChange={(value: any) =>
                    setMovimentacaoForm((prev) => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrega">Entrega</SelectItem>
                    <SelectItem value="emprestimo">Empréstimo</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                    <SelectItem value="substituicao">Substituição</SelectItem>
                    <SelectItem value="perda">Perda</SelectItem>
                    <SelectItem value="dano">Dano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dataMovimentacao">Data da Movimentação *</Label>
                <Input
                  id="dataMovimentacao"
                  type="date"
                  value={movimentacaoForm.dataMovimentacao}
                  onChange={(e) =>
                    setMovimentacaoForm((prev) => ({ ...prev, dataMovimentacao: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="colaboradorId">Colaborador *</Label>
                <Select
                  value={movimentacaoForm.colaboradorId ? String(movimentacaoForm.colaboradorId) : ""}
                  onValueChange={(value) =>
                    setMovimentacaoForm((prev) => ({ ...prev, colaboradorId: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores && colaboradores.length > 0 ? (
                      colaboradores.map((colab) => (
                        <SelectItem key={colab.id} value={String(colab.id)}>
                          {colab.nome} - {colab.funcao}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Nenhum colaborador cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="epiId">EPI (SKU) *</Label>
                <Select
                  value={movimentacaoForm.epiId ? String(movimentacaoForm.epiId) : ""}
                  onValueChange={(value) =>
                    setMovimentacaoForm((prev) => ({ ...prev, epiId: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o EPI" />
                  </SelectTrigger>
                  <SelectContent>
                    {episDisponiveis && episDisponiveis.length > 0 ? (
                      episDisponiveis
                        .filter((epi) => epi.status === "disponivel")
                        .map((epi) => (
                          <SelectItem key={epi.id} value={String(epi.id)}>
                            {epi.sku}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="0" disabled>
                        Nenhum EPI disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="motivo">Motivo</Label>
                <Input
                  id="motivo"
                  value={movimentacaoForm.motivo}
                  onChange={(e) =>
                    setMovimentacaoForm((prev) => ({ ...prev, motivo: e.target.value }))
                  }
                  placeholder="Ex: Substituição por vencimento, Dano durante uso..."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={movimentacaoForm.observacoes}
                  onChange={(e) =>
                    setMovimentacaoForm((prev) => ({ ...prev, observacoes: e.target.value }))
                  }
                  placeholder="Informações adicionais sobre a movimentação..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Assinatura Digital *</Label>
                {!movimentacaoForm.assinaturaUrl ? (
                  showSignature ? (
                    <SignatureCanvas
                      onSave={handleSaveSignature}
                      onClear={() => setMovimentacaoForm((prev) => ({ ...prev, assinaturaUrl: "" }))}
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowSignature(true)}
                    >
                      Coletar Assinatura
                    </Button>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="border rounded-lg p-4 bg-white">
                      <img
                        src={movimentacaoForm.assinaturaUrl}
                        alt="Assinatura"
                        className="w-full h-32 object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMovimentacaoForm((prev) => ({ ...prev, assinaturaUrl: "" }));
                        setShowSignature(true);
                      }}
                    >
                      Refazer Assinatura
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowSignature(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMovimentacao.isPending}>
                {createMovimentacao.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar Movimentação"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
