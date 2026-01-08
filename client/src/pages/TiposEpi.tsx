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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Loader2, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TipoEpiForm = {
  id?: number;
  nome: string;
  categoria: string;
  ca: string;
  fabricante: string;
  orientacoesUso: string;
  vidaUtilPadrao: number;
};

export default function TiposEpi() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoEpiForm | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tipos, isLoading, refetch } = trpc.tiposEpi.list.useQuery();

  const createTipo = trpc.tiposEpi.create.useMutation({
    onSuccess: () => {
      toast.success("Tipo de EPI cadastrado com sucesso!");
      setIsDialogOpen(false);
      setEditingTipo(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar tipo de EPI: ${error.message}`);
    },
  });

  const updateTipo = trpc.tiposEpi.update.useMutation({
    onSuccess: () => {
      toast.success("Tipo de EPI atualizado com sucesso!");
      setIsDialogOpen(false);
      setEditingTipo(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar tipo de EPI: ${error.message}`);
    },
  });

  const deleteTipo = trpc.tiposEpi.delete.useMutation({
    onSuccess: () => {
      toast.success("Tipo de EPI excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir tipo de EPI: ${error.message}`);
    },
  });

  const handleOpenDialog = (tipo?: any) => {
    if (tipo) {
      setEditingTipo({
        id: tipo.id,
        nome: tipo.nome,
        categoria: tipo.categoria,
        ca: tipo.ca,
        fabricante: tipo.fabricante || "",
        orientacoesUso: tipo.orientacoesUso || "",
        vidaUtilPadrao: tipo.vidaUtilPadrao,
      });
    } else {
      setEditingTipo({
        nome: "",
        categoria: "",
        ca: "",
        fabricante: "",
        orientacoesUso: "",
        vidaUtilPadrao: 12,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTipo) return;

    if (editingTipo.id) {
      updateTipo.mutate({
        id: editingTipo.id,
        nome: editingTipo.nome,
        categoria: editingTipo.categoria,
        ca: editingTipo.ca,
        fabricante: editingTipo.fabricante,
        orientacoesUso: editingTipo.orientacoesUso,
        vidaUtilPadrao: editingTipo.vidaUtilPadrao,
      });
    } else {
      createTipo.mutate({
        nome: editingTipo.nome,
        categoria: editingTipo.categoria,
        ca: editingTipo.ca,
        fabricante: editingTipo.fabricante,
        orientacoesUso: editingTipo.orientacoesUso,
        vidaUtilPadrao: editingTipo.vidaUtilPadrao,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este tipo de EPI?")) {
      deleteTipo.mutate({ id });
    }
  };

  const filteredTipos = tipos?.filter((t) =>
    t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.fabricante && t.fabricante.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                  <Package className="h-6 w-6" />
                  Tipos de EPI
                </CardTitle>
                <CardDescription>Cadastre os tipos de equipamentos de proteção individual</CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Tipo de EPI
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, categoria ou fabricante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>CA</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Vida Útil (meses)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTipos && filteredTipos.length > 0 ? (
                    filteredTipos.map((tipo) => (
                      <TableRow key={tipo.id}>
                        <TableCell className="font-medium">{tipo.nome}</TableCell>
                        <TableCell>{tipo.categoria}</TableCell>
                        <TableCell>{tipo.ca}</TableCell>
                        <TableCell>{tipo.fabricante || "-"}</TableCell>
                        <TableCell>{tipo.vidaUtilPadrao} meses</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(tipo)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(tipo.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum tipo de EPI encontrado
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
            <DialogTitle>
              {editingTipo?.id ? "Editar Tipo de EPI" : "Novo Tipo de EPI"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do tipo de equipamento
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do EPI *</Label>
                <Input
                  id="nome"
                  value={editingTipo?.nome || ""}
                  onChange={(e) =>
                    setEditingTipo((prev) => (prev ? { ...prev, nome: e.target.value } : null))
                  }
                  placeholder="Ex: Capacete de Segurança"
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Input
                  id="categoria"
                  value={editingTipo?.categoria || ""}
                  onChange={(e) =>
                    setEditingTipo((prev) => (prev ? { ...prev, categoria: e.target.value } : null))
                  }
                  placeholder="Ex: Proteção da Cabeça"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ca">Certificado de Aprovação (CA) *</Label>
                <Input
                  id="ca"
                  value={editingTipo?.ca || ""}
                  onChange={(e) =>
                    setEditingTipo((prev) => (prev ? { ...prev, ca: e.target.value } : null))
                  }
                  placeholder="Ex: CA 12345"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fabricante">Fabricante *</Label>
                <Input
                  id="fabricante"
                  value={editingTipo?.fabricante || ""}
                  onChange={(e) =>
                    setEditingTipo((prev) => (prev ? { ...prev, fabricante: e.target.value } : null))
                  }
                  placeholder="Nome do fabricante"
                  required
                />
              </div>

              <div>
                <Label htmlFor="vidaUtilPadrao">Vida Útil (meses) *</Label>
                <Input
                  id="vidaUtilPadrao"
                  type="number"
                  min="1"
                  value={editingTipo?.vidaUtilPadrao || 12}
                  onChange={(e) =>
                    setEditingTipo((prev) => (prev ? { ...prev, vidaUtilPadrao: parseInt(e.target.value) } : null))
                  }
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="orientacoesUso">Orientações de Uso</Label>
                <Textarea
                  id="orientacoesUso"
                  value={editingTipo?.orientacoesUso || ""}
                  onChange={(e) =>
                    setEditingTipo((prev) => (prev ? { ...prev, orientacoesUso: e.target.value } : null))
                  }
                  placeholder="Instruções de uso, cuidados e manutenção..."
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createTipo.isPending || updateTipo.isPending}
              >
                {createTipo.isPending || updateTipo.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
