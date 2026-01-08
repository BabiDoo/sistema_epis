import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useRoute } from "wouter";

export default function Prontuario() {
  const { user } = useAuth();
  const [, params] = useRoute("/prontuario/:id");
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Prontuário Digital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
            <p className="text-sm text-muted-foreground mt-2">ID: {params?.id}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
