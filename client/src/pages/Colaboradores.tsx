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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Loader2, Pencil, Plus, Search, Trash2, Upload, User, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ImportarColaboradoresCSV from "@/components/ImportarColaboradoresCSV";

type ColaboradorForm = {
  id?: number;
  empresaId: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  fotoUrl: string;
  funcao: string;
  setor: string;
  dataAdmissao: string;
  status: "ativo" | "inativo";
};

export default function Colaboradores() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<ColaboradorForm | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: colaboradores, isLoading, refetch } = trpc.colaboradores.list.useQuery();
  const { data: empresas } = trpc.empresas.list.useQuery();

  const createColaborador = trpc.colaboradores.create.useMutation({
    onSuccess: () => {
      toast.success("Colaborador cadastrado com sucesso!");
      setIsDialogOpen(false);
      setEditingColaborador(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar colaborador: ${error.message}`);
    },
  });

  const updateColaborador = trpc.colaboradores.update.useMutation({
    onSuccess: () => {
      toast.success("Colaborador atualizado com sucesso!");
      setIsDialogOpen(false);
      setEditingColaborador(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar colaborador: ${error.message}`);
    },
  });

  const deleteColaborador = trpc.colaboradores.delete.useMutation({
    onSuccess: () => {
      toast.success("Colaborador excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir colaborador: ${error.message}`);
    },
  });

  const handleOpenDialog = (colaborador?: any) => {
    if (colaborador) {
      setEditingColaborador({
        id: colaborador.id,
        empresaId: colaborador.empresaId,
        nome: colaborador.nome,
        cpf: colaborador.cpf || "",
        email: colaborador.email || "",
        telefone: colaborador.telefone || "",
        fotoUrl: colaborador.fotoUrl || "",
        funcao: colaborador.funcao,
        setor: colaborador.setor,
        dataAdmissao: new Date(colaborador.dataAdmissao).toISOString().split("T")[0],
        status: colaborador.status,
      });
    } else {
      setEditingColaborador({
        empresaId: empresas?.[0]?.id || 1,
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        fotoUrl: "",
        funcao: "",
        setor: "",
        dataAdmissao: new Date().toISOString().split("T")[0],
        status: "ativo",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColaborador) return;

    const baseData = {
      empresaId: editingColaborador.empresaId,
      nome: editingColaborador.nome,
      cpf: editingColaborador.cpf,
      email: editingColaborador.email,
      telefone: editingColaborador.telefone,
      fotoUrl: editingColaborador.fotoUrl,
      funcao: editingColaborador.funcao,
      setor: editingColaborador.setor,
      dataAdmissao: new Date(editingColaborador.dataAdmissao),
      status: editingColaborador.status,
    };

    if (editingColaborador.id) {
      updateColaborador.mutate({ ...baseData, id: editingColaborador.id });
    } else {
      createColaborador.mutate(baseData);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditingColaborador((prev) => (prev ? { ...prev, fotoUrl: base64 } : null));
        setUploading(false);
        toast.success("Foto carregada com sucesso!");
      };
      reader.onerror = () => {
        setUploading(false);
        toast.error("Erro ao carregar foto");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      toast.error("Erro ao fazer upload da foto");
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este colaborador?")) {
      deleteColaborador.mutate({ id });
    }
  };

  const filteredColaboradores = colaboradores?.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.setor.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <Users className="h-6 w-6" />
                  Gerenciamento de Colaboradores
                </CardTitle>
                <CardDescription>Cadastre e gerencie colaboradores da empresa</CardDescription>
              </div>
              <div className="flex gap-2">
                <ImportarColaboradoresCSV 
                  empresaId={empresas?.[0]?.id || 1} 
                  onSuccess={() => refetch()}
                />
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Colaborador
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, função ou setor..."
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
                    <TableHead>Foto</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColaboradores && filteredColaboradores.length > 0 ? (
                    filteredColaboradores.map((colaborador) => (
                      <TableRow key={colaborador.id}>
                        <TableCell>
                          {colaborador.fotoUrl ? (
                            <img
                              src={colaborador.fotoUrl}
                              alt={colaborador.nome}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{colaborador.nome}</TableCell>
                        <TableCell>{colaborador.cpf || "-"}</TableCell>
                        <TableCell>{colaborador.funcao}</TableCell>
                        <TableCell>{colaborador.setor}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              colaborador.status === "ativo"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-gray-500/10 text-gray-500"
                            }`}
                          >
                            {colaborador.status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(colaborador)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(colaborador.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum colaborador encontrado
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingColaborador?.id ? "Editar Colaborador" : "Novo Colaborador"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do colaborador abaixo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {editingColaborador?.fotoUrl ? (
                <img
                  src={editingColaborador.fotoUrl}
                  alt="Foto do colaborador"
                  className="h-24 w-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Label htmlFor="foto" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? "Carregando..." : "Carregar Foto"}
                </div>
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </Label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={editingColaborador?.nome || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) => (prev ? { ...prev, nome: e.target.value } : null))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={editingColaborador?.cpf || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) => (prev ? { ...prev, cpf: e.target.value } : null))
                  }
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={editingColaborador?.telefone || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) => (prev ? { ...prev, telefone: e.target.value } : null))
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingColaborador?.email || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) => (prev ? { ...prev, email: e.target.value } : null))
                  }
                  placeholder="colaborador@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="funcao">Função *</Label>
                <Input
                  id="funcao"
                  value={editingColaborador?.funcao || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) => (prev ? { ...prev, funcao: e.target.value } : null))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="setor">Setor *</Label>
                <Input
                  id="setor"
                  value={editingColaborador?.setor || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) => (prev ? { ...prev, setor: e.target.value } : null))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={editingColaborador?.dataAdmissao || ""}
                  onChange={(e) =>
                    setEditingColaborador((prev) =>
                      prev ? { ...prev, dataAdmissao: e.target.value } : null
                    )
                  }
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createColaborador.isPending || updateColaborador.isPending}
              >
                {createColaborador.isPending || updateColaborador.isPending ? (
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
