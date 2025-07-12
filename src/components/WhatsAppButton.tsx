import { Phone } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "989482441";
  const message = "Olá! Gostaria de fazer um pedido no Kalifa Burger Shop.";
  const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      aria-label="Contatar via WhatsApp"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton; 