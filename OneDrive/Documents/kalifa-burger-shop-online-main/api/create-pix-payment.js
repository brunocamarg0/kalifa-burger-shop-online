export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN; // Defina no Vercel/ambiente
    if (!accessToken) {
      return res.status(500).json({ error: 'Access token not configured' });
    }
  
    const body = req.body;
  
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          payment_method_id: 'pix',
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
  
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }