import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Search, Eye, Edit, Trash2, ClipboardList, AlertTriangle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function AvaliacoesCampo() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: avaliacoes, isLoading, refetch } = trpc.avaliacoesCampo.list.useQuery();
  const { data: empresas } = trpc.empresas.list.useQuery();

  const createMutation = trpc.avaliacoesCampo.create.useMutation({
    onSuccess: () => {
      toast.success("Avaliação de campo criada com sucesso!");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar avaliação");
    },
  });

  const updateMutation = trpc.avaliacoesCampo.update.useMutation({
    onSuccess: () => {
      toast.success("Avaliação atualizada com sucesso!");
      setIsDialogOpen(false);
      setEditingId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar avaliação");
    },
  });

  const deleteMutation = trpc.avaliacoesCampo.delete.useMutation({
    onSuccess: () => {
      toast.success("Avaliação excluída com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir avaliação");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      empresaId: parseInt(formData.get("empresaId") as string),
      setor: formData.get("setor") as string,
      dataAvaliacao: new Date(formData.get("dataAvaliacao") as string),
      tecnicoResponsavelId: user!.id,
      status: (formData.get("status") as "pendente" | "em_andamento" | "concluida") || "pendente",
      riscosFisicos: formData.get("riscosFisicos") as string,
      riscosQuimicos: formData.get("riscosQuimicos") as string,
      riscosBiologicos: formData.get("riscosBiologicos") as string,
      riscosErgonomicos: formData.get("riscosErgonomicos") as string,
      riscosAcidentes: formData.get("riscosAcidentes") as string,
      observacoesTecnicas: formData.get("observacoesTecnicas") as string,
      episRecomendados: formData.get("episRecomendados") as string,
      medidasControle: formData.get("medidasControle") as string,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredAvaliacoes = avaliacoes?.filter((avaliacao) =>
    avaliacao.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pendente: "secondary",
      em_andamento: "default",
      concluida: "destructive",
    };
    const labels: Record<string, string> = {
      pendente: "Pendente",
      em_andamento: "Em Andamento",
      concluida: "Concluída",
    };
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  if (!user || (user.role !== "admin" && user.role !== "tecnico_seguranca")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Acesso Negado
            </CardTitle>
            <CardDescription>
              Apenas administradores e técnicos de segurança podem acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")} className="w-full">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                Avaliações de Campo
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gestão de vistorias e identificação de riscos
              </p>
            </div>
            <Button onClick={() => setLocation("/dashboard")} variant="outline">
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Avaliações</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as avaliações de campo realizadas
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingId(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Avaliação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Editar Avaliação" : "Nova Avaliação de Campo"}
                    </DialogTitle>
                    <DialogDescription>
                      Preencha os dados da avaliação e identifique os riscos por categoria
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="empresaId">Empresa *</Label>
                        <Select name="empresaId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                          <SelectContent>
                            {empresas?.map((empresa) => (
                              <SelectItem key={empresa.id} value={empresa.id.toString()}>
                                {empresa.razaoSocial}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="setor">Setor *</Label>
                        <Input
                          id="setor"
                          name="setor"
                          placeholder="Ex: Produção, Almoxarifado, Manutenção"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataAvaliacao">Data da Avaliação *</Label>
                        <Input
                          id="dataAvaliacao"
                          name="dataAvaliacao"
                          type="date"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="pendente">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Identificação de Riscos</h3>

                      <div className="space-y-2">
                        <Label htmlFor="riscosFisicos">Riscos Físicos</Label>
                        <Textarea
                          id="riscosFisicos"
                          name="riscosFisicos"
                          placeholder="Ex: Ruído, vibração, temperatura extrema, radiação, pressão anormal"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="riscosQuimicos">Riscos Químicos</Label>
                        <Textarea
                          id="riscosQuimicos"
                          name="riscosQuimicos"
                          placeholder="Ex: Poeiras, fumos, névoas, neblinas, gases, vapores, substâncias químicas"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="riscosBiologicos">Riscos Biológicos</Label>
                        <Textarea
                          id="riscosBiologicos"
                          name="riscosBiologicos"
                          placeholder="Ex: Vírus, bactérias, protozoários, fungos, parasitas, bacilos"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="riscosErgonomicos">Riscos Ergonômicos</Label>
                        <Textarea
                          id="riscosErgonomicos"
                          name="riscosErgonomicos"
                          placeholder="Ex: Esforço físico intenso, levantamento de peso, postura inadequada, controle rígido de produtividade, trabalho em turno noturno, jornadas prolongadas, monotonia, repetitividade"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="riscosAcidentes">Riscos de Acidentes</Label>
                        <Textarea
                          id="riscosAcidentes"
                          name="riscosAcidentes"
                          placeholder="Ex: Arranjo físico inadequado, máquinas e equipamentos sem proteção, ferramentas inadequadas ou defeituosas, iluminação inadequada, eletricidade, probabilidade de incêndio ou explosão, armazenamento inadequado, animais peçonhentos"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Observações e Recomendações</h3>

                      <div className="space-y-2">
                        <Label htmlFor="observacoesTecnicas">Observações Técnicas</Label>
                        <Textarea
                          id="observacoesTecnicas"
                          name="observacoesTecnicas"
                          placeholder="Descreva detalhadamente as condições encontradas e observações relevantes"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="episRecomendados">EPIs Recomendados</Label>
                        <Textarea
                          id="episRecomendados"
                          name="episRecomendados"
                          placeholder="Liste os EPIs necessários para proteção dos colaboradores deste setor"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medidasControle">Medidas de Controle</Label>
                        <Textarea
                          id="medidasControle"
                          name="medidasControle"
                          placeholder="Descreva as medidas de controle sugeridas para eliminação ou redução dos riscos"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingId(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingId ? "Atualizar" : "Criar"} Avaliação
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por setor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : filteredAvaliacoes && filteredAvaliacoes.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Riscos Identificados</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAvaliacoes.map((avaliacao) => {
                      const riscosCount = [
                        avaliacao.riscosFisicos,
                        avaliacao.riscosQuimicos,
                        avaliacao.riscosBiologicos,
                        avaliacao.riscosErgonomicos,
                        avaliacao.riscosAcidentes,
                      ].filter(Boolean).length;

                      return (
                        <TableRow key={avaliacao.id}>
                          <TableCell className="font-medium">{avaliacao.setor}</TableCell>
                          <TableCell>
                            {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{getStatusBadge(avaliacao.status)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{riscosCount} categoria(s)</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  // TODO: Implementar visualização detalhada
                                  toast.info("Funcionalidade em desenvolvimento");
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingId(avaliacao.id);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.role === "admin" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(avaliacao.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando sua primeira avaliação de campo
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Avaliação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
