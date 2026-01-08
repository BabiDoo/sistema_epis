import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function AvaliacoesCampo() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Avaliações de Campo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
