import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BurgerCustomization, 
  MeatDoneness,
  BURGER_ADDONS, 
  BURGER_EXTRA_SAUCES, 
  BURGER_SACHETS,
  MEAT_DONENESS_OPTIONS 
} from '@/types/burger';
import { OrderItem } from '@/types/order';
import { Plus, X, Save } from 'lucide-react';

interface EditOrderItemCustomizationProps {
  item: OrderItem;
  basePrice: number;
  onSave: (item: OrderItem, newPrice: number) => void;
  onCancel: () => void;
}

const EditOrderItemCustomization = ({ 
  item, 
  basePrice, 
  onSave, 
  onCancel 
}: EditOrderItemCustomizationProps) => {
  const [meatDoneness, setMeatDoneness] = useState<MeatDoneness | undefined>(
    item.customization?.meatDoneness
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    item.customization?.addons.map(a => a.id) || []
  );
  const [selectedSauces, setSelectedSauces] = useState<string[]>(
    item.customization?.extraSauces.map(s => s.id) || []
  );
  const [selectedSachets, setSelectedSachets] = useState<string[]>(
    item.customization?.sachets.map(s => s.id) || []
  );
  const [observations, setObservations] = useState(
    item.customization?.observations || ''
  );

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else if (selectedAddons.length < 10) {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const toggleSauce = (sauceId: string) => {
    if (selectedSauces.includes(sauceId)) {
      setSelectedSauces(selectedSauces.filter(id => id !== sauceId));
    } else if (selectedSauces.length < 10) {
      setSelectedSauces([...selectedSauces, sauceId]);
    }
  };

  const toggleSachet = (sachetId: string) => {
    if (selectedSachets.includes(sachetId)) {
      setSelectedSachets(selectedSachets.filter(id => id !== sachetId));
    } else if (selectedSachets.length < 3) {
      setSelectedSachets([...selectedSachets, sachetId]);
    }
  };

  const calculateTotal = () => {
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = BURGER_ADDONS.find(a => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);

    const saucesTotal = selectedSauces.reduce((sum, id) => {
      const sauce = BURGER_EXTRA_SAUCES.find(s => s.id === id);
      return sum + (sauce?.price || 0);
    }, 0);

    return basePrice + addonsTotal + saucesTotal;
  };

  const handleSave = () => {
    if (!meatDoneness) {
      alert('Por favor, escolha o ponto da carne');
      return;
    }

    if (selectedSachets.length === 0 || selectedSachets.length > 3) {
      alert('Por favor, escolha entre 1 e 3 saches de molho');
      return;
    }

    const customization: BurgerCustomization = {
      meatDoneness,
      addons: selectedAddons.map(id => {
        const addon = BURGER_ADDONS.find(a => a.id === id);
        return { id: addon!.id, name: addon!.name, price: addon!.price };
      }),
      extraSauces: selectedSauces.map(id => {
        const sauce = BURGER_EXTRA_SAUCES.find(s => s.id === id);
        return { id: sauce!.id, name: sauce!.name, price: sauce!.price };
      }),
      sachets: selectedSachets.map(id => {
        const sachet = BURGER_SACHETS.find(s => s.id === id);
        return { id: sachet!.id, name: sachet!.name };
      }),
      observations: observations.trim() || undefined,
    };

    const newPrice = calculateTotal();
    const updatedItem: OrderItem = {
      ...item,
      price: newPrice,
      customization
    };

    onSave(updatedItem, newPrice);
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Editar {item.name}</CardTitle>
              <CardDescription>Edite as customizações do item do pedido</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ponto da Carne */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Qual ponto da carne? <Badge variant="destructive" className="ml-2">Obrigatório</Badge>
            </Label>
            <p className="text-sm text-muted-foreground mb-3">Escolha 1 item</p>
            <div className="space-y-2">
              {MEAT_DONENESS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <input
                    type="radio"
                    name="meatDoneness"
                    value={option.value}
                    checked={meatDoneness === option.value}
                    onChange={() => setMeatDoneness(option.value)}
                    className="w-4 h-4"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Turbine seu Burger */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              TURBINE SEU BURGUER
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Escolha até 10 itens ({selectedAddons.length}/10)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BURGER_ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {addon.price.toFixed(2)}
                        </p>
                      </div>
                      {isSelected ? (
                        <X className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Molho Extra */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              MOLHO EXTRA NO POTINHO
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Escolha até 10 itens ({selectedSauces.length}/10)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BURGER_EXTRA_SAUCES.map((sauce) => {
                const isSelected = selectedSauces.includes(sauce.id);
                return (
                  <button
                    key={sauce.id}
                    onClick={() => toggleSauce(sauce.id)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{sauce.name}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {sauce.price.toFixed(2)}
                        </p>
                      </div>
                      {isSelected ? (
                        <X className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Saches */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              ACEITA SACHE DE MOLHO? <Badge variant="destructive" className="ml-2">Obrigatório</Badge>
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Escolha entre 1 a 3 itens ({selectedSachets.length}/3)
            </p>
            <div className="grid grid-cols-3 gap-3">
              {BURGER_SACHETS.map((sachet) => {
                const isSelected = selectedSachets.includes(sachet.id);
                return (
                  <button
                    key={sachet.id}
                    onClick={() => toggleSachet(sachet.id)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{sachet.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Observações */}
          <div>
            <Label htmlFor="observations" className="text-base font-semibold mb-2 block">
              Observações
            </Label>
            <Textarea
              id="observations"
              placeholder="Ex: Tirar cebola, ovo, etc."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
            />
          </div>

          {/* Total e Botões */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Preço unitário</p>
              <p className="text-2xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Quantidade: {item.quantity} | Total: R$ {(total * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="min-w-[120px]">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditOrderItemCustomization;

