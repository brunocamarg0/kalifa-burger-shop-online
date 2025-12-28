import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBarbearias } from "@/context/BarbeariasContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Building2, User, Calendar, CreditCard, Mail, Phone, MapPin } from "lucide-react";
import { Barbearia } from "@/types/barbearia";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ativa: { label: "Ativa", variant: "default" },
  em_teste: { label: "Em Teste", variant: "secondary" },
  bloqueada: { label: "Bloqueada", variant: "destructive" },
  cancelada: { label: "Cancelada", variant: "outline" },
};

const planoConfig: Record<string, string> = {
  basico: "Básico",
  premium: "Premium",
  enterprise: "Enterprise",
};

export default function DetalhesBarbearia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBarbearia } = useBarbearias();
  const toast = useToast();
  const [barbearia, setBarbearia] = useState<Barbearia | undefined>();

  useEffect(() => {
    if (id) {
      const data = getBarbearia(id);
      if (data) {
        setBarbearia(data);
      } else {
        toast({
          title: "Barbearia não encontrada",
          description: "A barbearia solicitada não foi encontrada.",
          variant: "destructive",
        });
        navigate("/admin");
      }
    }
  }, [id, getBarbearia, navigate, toast]);

  if (!barbearia) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{barbearia.nome}</h2>
            <p className="text-muted-foreground">
              Detalhes completos da barbearia
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/admin/barbearias/${barbearia.id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{barbearia.nome}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">CNPJ / CPF</p>
              <p className="font-medium">{barbearia.cnpjCpf}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {barbearia.responsavel}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={statusConfig[barbearia.status].variant} className="mt-1">
                {statusConfig[barbearia.status].label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plano e Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Plano Contratado</p>
              <Badge variant="outline" className="mt-1">
                {planoConfig[barbearia.plano]}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Gateway de Pagamento</p>
              {barbearia.gatewayPagamento.conectado ? (
                <div className="mt-1">
                  <Badge variant="default" className="bg-green-500">
                    {barbearia.gatewayPagamento.nome}
                  </Badge>
                  {barbearia.gatewayPagamento.dataConexao && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Conectado em: {new Date(barbearia.gatewayPagamento.dataConexao).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="mt-1">Não conectado</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Datas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Data de Criação</p>
              <p className="font-medium">
                {new Date(barbearia.dataCriacao).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Data de Vencimento</p>
              <p className="font-medium">
                {new Date(barbearia.dataVencimento).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {barbearia.email && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium">{barbearia.email}</p>
                </div>
                {barbearia.telefone && <Separator />}
              </>
            )}
            {barbearia.telefone && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </p>
                <p className="font-medium">{barbearia.telefone}</p>
              </div>
            )}
            {barbearia.endereco && (
              <>
                {(barbearia.email || barbearia.telefone) && <Separator />}
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </p>
                  <p className="font-medium">{barbearia.endereco}</p>
                </div>
              </>
            )}
            {!barbearia.email && !barbearia.telefone && !barbearia.endereco && (
              <p className="text-sm text-muted-foreground">Nenhum contato cadastrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

