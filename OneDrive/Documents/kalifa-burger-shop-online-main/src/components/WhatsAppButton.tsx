import { Phone } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "19989482441";
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-white" width="24" height="24"><path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.74 6.41L3.2 28.8l6.59-1.72c1.87 1.02 3.98 1.56 6.21 1.56h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.64-3.75-9.06C22.641 4.53 19.421 3.2 16.001 3.2zm0 23.2c-2.01 0-3.98-.53-5.68-1.54l-.41-.24-3.91 1.02 1.04-3.81-.27-.39c-1.09-1.6-1.67-3.47-1.67-5.38 0-5.7 4.63-10.33 10.33-10.33 2.76 0 5.36 1.08 7.32 3.04 1.96 1.96 3.04 4.56 3.04 7.32 0 5.7-4.63 10.33-10.33 10.33zm5.67-7.74c-.31-.16-1.84-.91-2.13-1.01-.29-.11-.5-.16-.71.16-.21.31-.81 1.01-.99 1.22-.18.21-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.13-.63.13-.13.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.53-.54-.73-.55-.19-.01-.39-.01-.6-.01-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.54 1.13 3.03 1.29 3.24.16.21 2.23 3.41 5.41 4.65.76.33 1.36.53 1.83.68.77.25 1.47.21 2.02.13.62-.09 1.84-.75 2.1-1.48.26-.73.26-1.36.18-1.48-.08-.13-.28-.21-.59-.37z"/></svg>
    </a>
  );
};

export default WhatsAppButton; 