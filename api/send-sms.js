// API function para enviar SMS via Twilio
// Deploy no Vercel como serverless function

const twilio = require('twilio');

export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    const { to, message, type } = req.body;

    // Validar dados obrigatórios
    if (!to || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Telefone e mensagem são obrigatórios' 
      });
    }

    // Configurações do Twilio
    const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.VITE_TWILIO_PHONE_NUMBER;

    // Verificar se as credenciais estão configuradas
    if (!accountSid || !authToken || !fromNumber) {
      console.error('❌ Credenciais do Twilio não configuradas');
      return res.status(500).json({ 
        success: false, 
        error: 'Serviço de SMS não configurado' 
      });
    }

    // Criar cliente Twilio
    const client = twilio(accountSid, authToken);

    // Formatar número de telefone (adicionar código do Brasil se necessário)
    let formattedPhone = to.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    // Adicionar código do Brasil se não estiver presente
    if (!formattedPhone.startsWith('55')) {
      formattedPhone = '55' + formattedPhone;
    }
    
    // Adicionar + no início
    formattedPhone = '+' + formattedPhone;

    console.log('📱 Enviando SMS via Twilio...');
    console.log('📞 De:', fromNumber);
    console.log('📞 Para:', formattedPhone);
    console.log('💬 Mensagem:', message);

    // Enviar SMS
    const twilioMessage = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedPhone
    });

    console.log('✅ SMS enviado com sucesso! SID:', twilioMessage.sid);

    // Retornar sucesso
    return res.status(200).json({
      success: true,
      sid: twilioMessage.sid,
      status: twilioMessage.status,
      type: type || 'unknown'
    });

  } catch (error) {
    console.error('❌ Erro ao enviar SMS:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
} 