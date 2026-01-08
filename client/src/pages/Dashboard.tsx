import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Shield, Package, AlertTriangle, CheckCircle, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role === "colaborador") {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={user} />
        <div className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo, {user.name}</CardTitle>
              <CardDescription>Acesse seu prontuário digital para visualizar seus EPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/prontuario/${user.colaboradorId}`}>
                  <Shield className="mr-2 h-4 w-4" />
                  Ver Meu Prontuário
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de EPIs"
            value={stats?.totalEpis || 0}
            icon={<Package className="h-5 w-5" />}
            description="Equipamentos cadastrados"
          />
          <StatCard
            title="EPIs em Uso"
            value={stats?.episEmUso || 0}
            icon={<Shield className="h-5 w-5" />}
            description="Emprestados a colaboradores"
            variant="info"
          />
          <StatCard
            title="EPIs Disponíveis"
            value={stats?.episDisponiveis || 0}
            icon={<CheckCircle className="h-5 w-5" />}
            description="Prontos para empréstimo"
            variant="success"
          />
          <StatCard
            title="EPIs Vencidos"
            value={stats?.episVencidos || 0}
            icon={<AlertTriangle className="h-5 w-5" />}
            description="Necessitam substituição"
            variant="warning"
          />
        </div>

        {/* Colaboradores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Colaboradores Ativos
            </CardTitle>
            <CardDescription>Total de colaboradores cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalColaboradores || 0}</div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(user.role === "admin" || user.role === "almoxarife") && (
            <>
              <QuickActionCard
                title="Gerenciar EPIs"
                description="Cadastrar e controlar equipamentos"
                href="/epis"
                icon={<Package className="h-6 w-6" />}
              />
              <QuickActionCard
                title="Movimentações"
                description="Empréstimos, trocas e devoluções"
                href="/movimentacoes"
                icon={<Shield className="h-6 w-6" />}
              />
              <QuickActionCard
                title="Colaboradores"
                description="Gerenciar colaboradores"
                href="/colaboradores"
                icon={<Users className="h-6 w-6" />}
              />
            </>
          )}
          {(user.role === "admin" || user.role === "tecnico_seguranca") && (
            <QuickActionCard
              title="Avaliações de Campo"
              description="Vistorias técnicas e riscos"
              href="/avaliacoes-campo"
              icon={<AlertTriangle className="h-6 w-6" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, {user.name} - {getRoleName(user.role)}
            </p>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            {(user.role === "admin" || user.role === "almoxarife") && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/epis">EPIs</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/colaboradores">Colaboradores</Link>
                </Button>
              </>
            )}
            {(user.role === "admin" || user.role === "tecnico_seguranca") && (
              <Button variant="ghost" asChild>
                <Link href="/avaliacoes-campo">Avaliações</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  variant = "default",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  variant?: "default" | "success" | "warning" | "info";
}) {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-green-500/10 border-green-500/20",
    warning: "bg-orange-500/10 border-orange-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  };

  const iconStyles = {
    default: "text-foreground",
    success: "text-green-500",
    warning: "text-orange-500",
    info: "text-blue-500",
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={iconStyles[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">{icon}</div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

function getRoleName(role: string): string {
  const roles: Record<string, string> = {
    admin: "Administrador",
    tecnico_seguranca: "Técnico de Segurança",
    almoxarife: "Almoxarife",
    colaborador: "Colaborador",
  };
  return roles[role] || role;
}
