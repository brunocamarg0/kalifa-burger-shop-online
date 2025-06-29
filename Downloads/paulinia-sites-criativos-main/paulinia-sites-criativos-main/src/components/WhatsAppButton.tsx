
const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "5519999999999"; // Replace with actual WhatsApp number
    const message = encodeURIComponent("Olá! Gostaria de solicitar um orçamento para criação de site.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 animate-bounce-light"
      aria-label="Falar no WhatsApp"
    >
      <div className="w-8 h-8 text-2xl">💬</div>
    </button>
  );
};

export default WhatsAppButton;
