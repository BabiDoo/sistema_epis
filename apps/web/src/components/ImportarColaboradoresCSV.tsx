import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ColaboradorCSV {
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  funcao?: string;
  setor?: string;
  dataAdmissao?: Date;
}

interface ImportarColaboradoresCSVProps {
  empresaId: number;
  onSuccess?: () => void;
}

export default function ImportarColaboradoresCSV({ empresaId, onSuccess }: ImportarColaboradoresCSVProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [colaboradores, setColaboradores] = useState<ColaboradorCSV[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const importarMutation = trpc.colaboradores.importarCSV.useMutation({
    onSuccess: (data) => {
      setResultado(data);
      toast.success(`${data.sucesso} colaborador(es) importado(s) com sucesso!`);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao importar colaboradores");
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const linhas = csv.split("\n").filter((l) => l.trim());
        const colaboradoresTemp: ColaboradorCSV[] = [];

        // Pular header (primeira linha)
        for (let i = 1; i < linhas.length; i++) {
          const valores = linhas[i].split(",").map((v) => v.trim());
          if (valores.length < 2) continue; // Pular linhas inválidas

          const dataAdmissaoStr = valores[6];
          let dataAdmissao: Date | undefined;
          if (dataAdmissaoStr) {
            dataAdmissao = new Date(dataAdmissaoStr);
            if (isNaN(dataAdmissao.getTime())) {
              dataAdmissao = undefined;
            }
          }

          colaboradoresTemp.push({
            nome: valores[0] || "",
            cpf: valores[1] || "",
            telefone: valores[2],
            email: valores[3],
            funcao: valores[4],
            setor: valores[5],
            dataAdmissao,
          });
        }

        if (colaboradoresTemp.length === 0) {
          toast.error("Nenhum colaborador encontrado no arquivo");
          return;
        }

        setColaboradores(colaboradoresTemp);
        toast.success(`${colaboradoresTemp.length} colaborador(es) carregado(s) para revisão`);
      } catch (error) {
        toast.error("Erro ao processar arquivo CSV");
      }
    };
    reader.readAsText(file);
  };

  const handleImportar = async () => {
    if (colaboradores.length === 0) {
      toast.error("Nenhum colaborador para importar");
      return;
    }

    setIsLoading(true);
    try {
      await importarMutation.mutateAsync({
        empresaId,
        colaboradores,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFechar = () => {
    setColaboradores([]);
    setResultado(null);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-2">
        <Upload className="h-4 w-4" />
        Importar CSV
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Colaboradores via CSV</DialogTitle>
            <DialogDescription>
              Carregue um arquivo CSV com as colunas: Nome, CPF, Telefone, Email, Função, Setor, Data de Admissão
            </DialogDescription>
          </DialogHeader>

          {!resultado ? (
            <div className="space-y-4">
              {colaboradores.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecione um arquivo CSV para importar colaboradores
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button asChild variant="default">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      Selecionar Arquivo
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      {colaboradores.length} colaborador(es) pronto(s) para importar. Revise os dados abaixo antes de confirmar.
                    </p>
                  </div>

                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Setor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {colaboradores.map((colab, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{colab.nome}</TableCell>
                            <TableCell>{colab.cpf}</TableCell>
                            <TableCell>{colab.telefone || "-"}</TableCell>
                            <TableCell>{colab.email || "-"}</TableCell>
                            <TableCell>{colab.funcao || "-"}</TableCell>
                            <TableCell>{colab.setor || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setColaboradores([]);
                        document.getElementById("csv-upload")?.click();
                      }}
                      variant="outline"
                    >
                      Carregar Outro Arquivo
                    </Button>
                    <Button
                      onClick={handleImportar}
                      disabled={isLoading}
                      className="ml-auto"
                    >
                      {isLoading ? "Importando..." : "Confirmar Importação"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-green-900">Importação Concluída</p>
                </div>
                <p className="text-sm text-green-800">
                  {resultado.sucesso} colaborador(es) importado(s) com sucesso
                </p>
                {resultado.erro > 0 && (
                  <p className="text-sm text-red-800 mt-2">
                    {resultado.erro} erro(s) encontrado(s)
                  </p>
                )}
              </div>

              {resultado.detalhes && resultado.detalhes.length > 0 && (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mensagem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultado.detalhes.map((detalhe: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{detalhe.nome}</TableCell>
                          <TableCell>{detalhe.cpf}</TableCell>
                          <TableCell>
                            {detalhe.status === "sucesso" ? (
                              <span className="text-green-600 font-medium">✓ Sucesso</span>
                            ) : (
                              <span className="text-red-600 font-medium">✗ Erro</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {detalhe.mensagem || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <Button onClick={handleFechar} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
