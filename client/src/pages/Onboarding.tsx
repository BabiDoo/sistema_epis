import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Building2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Onboarding() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    razaoSocial: "",
    cnpj: "",
    segmento: "",
    grauRisco: 1,
    endereco: "",
    municipio: "",
    uf: "",
    cep: "",
  });

  const createEmpresa = trpc.empresas.create.useMutation({
    onSuccess: () => {
      toast.success("Empresa cadastrada com sucesso!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar empresa: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.razaoSocial || !formData.cnpj) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    createEmpresa.mutate(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Bem-vindo ao Sistema de Controle de EPIs</CardTitle>
          <CardDescription className="text-base">
            Para começar, precisamos de algumas informações sobre sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="razaoSocial">
                  Razão Social <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={(e) => handleChange("razaoSocial", e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cnpj">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="segmento">Segmento</Label>
                <Input
                  id="segmento"
                  value={formData.segmento}
                  onChange={(e) => handleChange("segmento", e.target.value)}
                  placeholder="Ex: Construção Civil, Indústria"
                />
              </div>

              <div>
                <Label htmlFor="grauRisco">
                  Grau de Risco <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.grauRisco.toString()}
                  onValueChange={(value) => handleChange("grauRisco", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grau de risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Grau 1 - Risco Mínimo</SelectItem>
                    <SelectItem value="2">Grau 2 - Risco Baixo</SelectItem>
                    <SelectItem value="3">Grau 3 - Risco Médio</SelectItem>
                    <SelectItem value="4">Grau 4 - Risco Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div>
                <Label htmlFor="municipio">Município</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => handleChange("municipio", e.target.value)}
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => handleChange("uf", e.target.value.toUpperCase())}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleChange("cep", e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={createEmpresa.isPending}
              >
                {createEmpresa.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  "Concluir Cadastro"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
