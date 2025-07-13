import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import PhoneInput from './PhoneInput';

const SMSTest = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const sendTestSMS = async () => {
    if (!phone) {
      toast({
        title: "Telefone obrigatório",
        description: "Digite um número de telefone para testar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const testMessage = `🍔 Kalifa Burger - Teste de SMS!

Este é um SMS de teste do sistema da Kalifa Burger.
Data: ${new Date().toLocaleString('pt-BR')}

Se você recebeu esta mensagem, o sistema está funcionando! 🎉`;

      console.log('🧪 Enviando SMS de teste...');
      console.log('📞 Para:', phone);
      console.log('💬 Mensagem:', testMessage);

      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: testMessage,
          type: 'test'
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: `SMS enviado com sucesso! SID: ${data.sid}`
        });
        
        toast({
          title: "SMS enviado! 🎉",
          description: "Verifique seu telefone para confirmar o recebimento.",
        });
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('❌ Erro ao enviar SMS de teste:', error);
      
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });

      toast({
        title: "Erro ao enviar SMS",
        description: "Verifique as configurações do Twilio.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-warm max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📱 Teste de SMS
        </CardTitle>
        <CardDescription>
          Envie um SMS de teste para verificar se o sistema está funcionando
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            label="Número de Telefone"
            placeholder="(11) 99999-9999"
            required={true}
          />
        </div>

        <Button
          onClick={sendTestSMS}
          disabled={loading || !phone}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar SMS de Teste
            </>
          )}
        </Button>

        {result && (
          <div className={`p-3 rounded-lg ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Use seu próprio número para testar</p>
          <p>• Verifique se o Twilio está configurado</p>
          <p>• SMS de teste é gratuito no plano free</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SMSTest; 