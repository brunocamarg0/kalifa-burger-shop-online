import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { smsService } from '../services/smsService';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const PhoneInput = ({ 
  value, 
  onChange, 
  label = "Telefone", 
  placeholder = "(11) 99999-9999",
  required = false,
  className = ""
}: PhoneInputProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Validar telefone quando o valor mudar
  useEffect(() => {
    if (value) {
      const valid = smsService.validatePhoneNumber(value);
      setIsValid(valid);
    } else {
      setIsValid(null);
    }
  }, [value]);

  // Formatar telefone automaticamente
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    // Limita a 11 dígitos
    if (input.length > 11) {
      input = input.slice(0, 11);
    }
    
    // Formata o telefone
    let formatted = input;
    if (input.length >= 2) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2)}`;
    }
    if (input.length >= 7) {
      formatted = `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7)}`;
    }
    
    onChange(formatted);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="phone" className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`pr-10 ${
            isValid === true ? 'border-green-500 focus:border-green-500' : 
            isValid === false ? 'border-red-500 focus:border-red-500' : ''
          }`}
        />
        
        {/* Ícone de validação */}
        {value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid === true ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : isValid === false ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Mensagens de ajuda */}
      {isFocused && !value && (
        <p className="text-xs text-muted-foreground">
          Digite seu número de telefone para receber notificações do pedido
        </p>
      )}
      
      {isValid === false && value && (
        <p className="text-xs text-red-500">
          Digite um número de telefone válido (ex: (11) 99999-9999)
        </p>
      )}
      
      {isValid === true && (
        <p className="text-xs text-green-600">
          ✓ Número válido - Você receberá SMS de confirmação
        </p>
      )}
    </div>
  );
};

export default PhoneInput; 