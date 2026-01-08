import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Shield, ClipboardCheck, Users, FileText, AlertTriangle, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistema de Controle de EPIs</h1>
              <p className="text-xs text-muted-foreground">Gestão e Avaliação de Campo</p>
            </div>
          </div>
          <Button asChild>
            <a href={getLoginUrl("/onboarding")}>Entrar no Sistema</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Conformidade com NR 6
          </div>
          <h2 className="text-5xl font-bold text-foreground leading-tight">
            Controle Completo de Equipamentos de Proteção Individual
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema profissional para gestão de EPIs, rastreabilidade completa, avaliações de campo e conformidade legal em segurança do trabalho.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <a href={getLoginUrl("/onboarding")}>Começar Agora</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#recursos">Conhecer Recursos</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">Recursos Principais</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Funcionalidades completas para controle, rastreamento e conformidade de EPIs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Gestão de EPIs"
            description="Cadastro completo de tipos de EPI, controle individual por SKU, rastreamento de status e validade."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Controle de Colaboradores"
            description="Prontuário digital completo com histórico de movimentações, assinaturas digitais e EPIs ativos."
          />
          <FeatureCard
            icon={<ClipboardCheck className="h-8 w-8" />}
            title="Avaliações de Campo"
            description="Vistorias técnicas estruturadas por setor com identificação de riscos físicos, químicos e biológicos."
          />
          <FeatureCard
            icon={<AlertTriangle className="h-8 w-8" />}
            title="Sistema de Alertas"
            description="Notificações automáticas para EPIs próximos do vencimento e painel de irregularidades."
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8" />}
            title="Relatórios e Exportação"
            description="Relatórios completos em PDF e Excel para auditorias e análises gerenciais."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Dashboard Administrativo"
            description="Visão geral de EPIs em uso, vencidos, disponíveis e últimas movimentações."
          />
        </div>
      </section>

      {/* Perfis de Acesso */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">Perfis de Acesso</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sistema com controle de permissões para diferentes níveis de usuários
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoleCard
            title="Administrador"
            description="Controle total do sistema, configurações gerais e gestão de usuários."
          />
          <RoleCard
            title="Técnico de Segurança"
            description="Realização de avaliações técnicas de campo e registro de riscos."
          />
          <RoleCard
            title="Almoxarife"
            description="Gestão de EPIs, empréstimos, trocas e devoluções com assinatura digital."
          />
          <RoleCard
            title="Colaborador"
            description="Visualização de EPIs sob sua responsabilidade e consulta de orientações."
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12 text-center border border-primary/20">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Acesse o sistema e comece a gerenciar seus equipamentos de proteção individual com segurança e conformidade legal.
          </p>
          <Button size="lg" asChild>
            <a href={getLoginUrl("/onboarding")}>Acessar Sistema</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Sistema de Controle de EPIs e Avaliação de Campo</p>
          <p className="mt-2">Conformidade com NR 6 - Norma Regulamentadora de EPIs</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="bg-primary/10 w-fit p-3 rounded-lg mb-4 text-primary">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-card-foreground mb-2">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function RoleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
      <h4 className="text-lg font-semibold text-card-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
