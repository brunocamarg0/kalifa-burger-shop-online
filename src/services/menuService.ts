import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  spicy?: boolean;
}

// Produtos padrão para inicialização
const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Hamburger Paulinia Classic",
    description: "Hambúrguer artesanal 180g, queijo cheddar, alface, tomate, cebola e molho especial",
    price: 1,
    image: "/placeholder.svg",
    category: "classics",
    popular: true,
  },
  {
    id: 2,
    name: "Bacon Supreme",
    description: "Hambúrguer 200g, bacon crocante, queijo cheddar duplo, cebola caramelizada",
    price: 29.90,
    image: "/placeholder.svg",
    category: "premium",
    popular: true,
  },
  {
    id: 3,
    name: "BBQ Monster",
    description: "Hambúrguer 250g, molho barbecue artesanal, onion rings, queijo provolone",
    price: 32.90,
    image: "/placeholder.svg",
    category: "premium",
  },
  {
    id: 4,
    name: "Spicy Fire",
    description: "Hambúrguer 180g, pimenta jalapeño, queijo pepper jack, molho picante da casa",
    price: 27.90,
    image: "/placeholder.svg",
    category: "specials",
    spicy: true,
  },
  {
    id: 5,
    name: "Veggie Deluxe",
    description: "Hambúrguer vegano de grão-de-bico, queijo vegano, rúcula, tomate seco",
    price: 26.90,
    image: "/placeholder.svg",
    category: "veggie",
  },
  {
    id: 6,
    name: "Double Trouble",
    description: "Dois hambúrgueres 150g, queijo cheddar duplo, bacon, molho mil-ilhas",
    price: 35.90,
    image: "/placeholder.svg",
    category: "premium",
    popular: true,
  },
];

class MenuService {
  private readonly COLLECTION_NAME = 'menuItems';
  private readonly FALLBACK_KEY = 'kalifa_burger_menu_items_fallback';

  // Carregar todos os produtos
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const menuRef = collection(db, this.COLLECTION_NAME);
      const q = query(menuRef, orderBy('id', 'asc'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Se não houver produtos, inicializar com os padrões
        await this.initializeMenuItems();
        return defaultMenuItems;
      }

      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image || "/placeholder.svg",
          category: data.category || "classics",
          popular: data.popular || false,
          spicy: data.spicy || false,
        });
      });
      
      // Ordenar por ID
      items.sort((a, b) => a.id - b.id);

      // Salvar no localStorage como fallback
      localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(items));
      return items;
    } catch (error) {
      console.error('Erro ao carregar produtos do Firebase:', error);
      
      // Fallback para localStorage
      const fallback = localStorage.getItem(this.FALLBACK_KEY);
      if (fallback) {
        return JSON.parse(fallback);
      }
      
      // Fallback final: produtos padrão
      return defaultMenuItems;
    }
  }

  // Inicializar produtos padrão no Firebase
  async initializeMenuItems(): Promise<void> {
    try {
      for (const item of defaultMenuItems) {
        await addDoc(collection(db, this.COLLECTION_NAME), {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar produtos:', error);
    }
  }

  // Atualizar preço de um produto
  async updateProductPrice(productId: number, newPrice: number): Promise<void> {
    try {
      const menuRef = collection(db, this.COLLECTION_NAME);
      const querySnapshot = await getDocs(menuRef);
      
      let productDoc: any = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().id === productId) {
          productDoc = doc;
        }
      });

      if (productDoc) {
        await updateDoc(doc(db, this.COLLECTION_NAME, productDoc.id), {
          price: newPrice,
          updatedAt: serverTimestamp(),
        });

        // Atualizar fallback no localStorage
        const items = await this.getMenuItems();
        const updatedItems = items.map(item => 
          item.id === productId ? { ...item, price: newPrice } : item
        );
        localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(updatedItems));
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      throw error;
    }
  }

  // Atualizar produto completo
  async updateProduct(productId: number, updates: Partial<MenuItem>): Promise<void> {
    try {
      const menuRef = collection(db, this.COLLECTION_NAME);
      const querySnapshot = await getDocs(menuRef);
      
      let productDoc: any = null;
      querySnapshot.forEach((doc) => {
        if (doc.data().id === productId) {
          productDoc = doc;
        }
      });

      if (productDoc) {
        await updateDoc(doc(db, this.COLLECTION_NAME, productDoc.id), {
          ...updates,
          updatedAt: serverTimestamp(),
        });

        // Atualizar fallback no localStorage
        const items = await this.getMenuItems();
        const updatedItems = items.map(item => 
          item.id === productId ? { ...item, ...updates } : item
        );
        localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(updatedItems));
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();

