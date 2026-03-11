import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Download, FileText, Loader2, User } from "lucide-react";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Prontuario() {
  const { user } = useAuth();
  const [, params] = useRoute("/prontuario/:id");
  const colaboradorId = params?.id ? parseInt(params.id) : 0;

  const { data: colaborador, isLoading: loadingColaborador } = trpc.colaboradores.getById.useQuery(
    { id: colaboradorId },
    { enabled: colaboradorId > 0 }
  );

  const { data: movimentacoes, isLoading: loadingMovimentacoes } = trpc.movimentacoes.list.useQuery(
    { colaboradorId },
    { enabled: colaboradorId > 0 }
  );

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

  const handleExportPDF = () => {
    toast.info("Funcionalidade de exportação em PDF será implementada em breve");
  };

  if (loadingColaborador || loadingMovimentacoes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!colaborador) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Colaborador não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filtrar movimentações ativas (EPIs em uso)
  const episEmUso = movimentacoes?.filter(
    (mov) => mov.tipo === "entrega" || mov.tipo === "emprestimo" || mov.tipo === "substituicao"
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Cabeçalho */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {colaborador.fotoUrl ? (
                    <img
                      src={colaborador.fotoUrl}
                      alt={colaborador.nome}
                      className="h-20 w-20 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <FileText className="h-6 w-6" />
                      Prontuário Digital
                    </CardTitle>
                    <CardDescription>
                      Histórico completo de movimentações de EPIs
                    </CardDescription>
                  </div>
                </div>
                <Button onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Dados do Colaborador */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Colaborador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                  <p className="text-base font-semibold">{colaborador.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPF</p>
                  <p className="text-base font-semibold">{colaborador.cpf || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Função</p>
                  <p className="text-base font-semibold">{colaborador.funcao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Setor</p>
                  <p className="text-base font-semibold">{colaborador.setor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base font-semibold">{colaborador.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-base font-semibold">{colaborador.telefone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Admissão</p>
                  <p className="text-base font-semibold">
                    {format(new Date(colaborador.dataAdmissao), "dd/MM/yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={colaborador.status === "ativo" ? "default" : "secondary"}>
                    {colaborador.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EPIs em Uso */}
          <Card>
            <CardHeader>
              <CardTitle>EPIs Atualmente em Uso</CardTitle>
              <CardDescription>
                Equipamentos de proteção individual sob responsabilidade do colaborador
              </CardDescription>
            </CardHeader>
            <CardContent>
              {episEmUso && episEmUso.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>EPI (SKU)</TableHead>
                        <TableHead>Tipo de Movimentação</TableHead>
                        <TableHead>Data de Entrega</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {episEmUso.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell className="font-mono font-medium">{mov.epiId}</TableCell>
                          <TableCell>{getTipoBadge(mov.tipo)}</TableCell>
                          <TableCell>
                            {format(new Date(mov.dataMovimentacao), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {mov.observacoes || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum EPI em uso no momento
                </p>
              )}
            </CardContent>
          </Card>

          {/* Histórico Completo de Movimentações */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico Completo de Movimentações</CardTitle>
              <CardDescription>
                Todas as movimentações de EPIs registradas com assinaturas digitais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {movimentacoes && movimentacoes.length > 0 ? (
                <div className="space-y-4">
                  {movimentacoes.map((mov, index) => (
                    <div key={mov.id}>
                      <div className="grid md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Data</p>
                          <p className="text-base font-semibold">
                            {format(new Date(mov.dataMovimentacao), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                          <div className="mt-1">{getTipoBadge(mov.tipo)}</div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">EPI (SKU)</p>
                          <p className="text-base font-mono font-semibold">{mov.epiId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Assinatura</p>
                          {mov.assinaturaUrl ? (
                            <img
                              src={mov.assinaturaUrl}
                              alt="Assinatura"
                              className="h-12 w-24 object-contain border rounded bg-white mt-1"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">Não disponível</p>
                          )}
                        </div>
                        {mov.motivo && (
                          <div className="md:col-span-4">
                            <p className="text-sm font-medium text-muted-foreground">Motivo</p>
                            <p className="text-sm">{mov.motivo}</p>
                          </div>
                        )}
                        {mov.observacoes && (
                          <div className="md:col-span-4">
                            <p className="text-sm font-medium text-muted-foreground">Observações</p>
                            <p className="text-sm">{mov.observacoes}</p>
                          </div>
                        )}
                      </div>
                      {index < movimentacoes.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhuma movimentação registrada
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
