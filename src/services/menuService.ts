import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
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

// Produtos padrão para inicialização - Cardápio Kalifa Burguer
const defaultMenuItems: MenuItem[] = [
  // Hambúrgueres
  {
    id: 1,
    name: "San Diego",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Duplo Queijo Cheddar, Fatias De Bacon, Cebola Empanada, Molho Barbecue",
    price: 37.90,
    image: "/placeholder.svg",
    category: "premium",
    popular: true,
  },
  {
    id: 2,
    name: "San Francisco",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Duplo Queijo Cheddar, Fatias De Bacon, Cebola Caramelizada, Molho Barbecue",
    price: 37.90,
    image: "/placeholder.svg",
    category: "premium",
    popular: true,
  },
  {
    id: 3,
    name: "Santa Clarita",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Duplo Queijo Cheddar, Maionese Da Casa",
    price: 24.90,
    image: "/placeholder.svg",
    category: "classics",
  },
  {
    id: 4,
    name: "Kings",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Duplo Queijo Cheddar, Fatias De Bacon, Tomate, Alface Americana, Maionese",
    price: 34.90,
    image: "/placeholder.svg",
    category: "premium",
  },
  {
    id: 5,
    name: "Los Angeles",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Duplo Queijo Cheddar, Cebola Roxa, Tomate, Alface Americana, Maionese Da Casa",
    price: 27.90,
    image: "/placeholder.svg",
    category: "classics",
  },
  {
    id: 6,
    name: "Beverly Hills",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Queijo Gorgonzola Cremoso, Fatias De Bacon, Cebola Crispy Crocante",
    price: 37.90,
    image: "/placeholder.svg",
    category: "premium",
  },
  {
    id: 7,
    name: "Califórnia",
    description: "Pão Brioche, Hambúrguer Artesanal Suculento, Duplo Queijo Cheddar, Requeijão Empanado, Rúcula, Geleia De Pimenta",
    price: 42.90,
    image: "/placeholder.svg",
    category: "premium",
    popular: true,
  },
  // Porções
  {
    id: 8,
    name: "Batatinha Frita Tamanho Único",
    description: "Serve bem duas pessoas, acompanha molho",
    price: 15.90,
    image: "/placeholder.svg",
    category: "specials",
  },
  {
    id: 9,
    name: "CRINKLE CHEDDAR E BACON",
    description: "Batata crinkle com queijo cheddar e bacon",
    price: 32.90,
    image: "/placeholder.svg",
    category: "specials",
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

  // Escutar mudanças em tempo real nos produtos
  subscribeToMenuItems(callback: (items: MenuItem[]) => void): () => void {
    try {
      const menuRef = collection(db, this.COLLECTION_NAME);
      const q = query(menuRef, orderBy('id', 'asc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          callback(defaultMenuItems);
          return;
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
        
        items.sort((a, b) => a.id - b.id);
        
        // Salvar no localStorage como fallback
        localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(items));
        callback(items);
      }, (error) => {
        console.error('Erro ao escutar produtos:', error);
        // Fallback para localStorage
        const fallback = localStorage.getItem(this.FALLBACK_KEY);
        if (fallback) {
          callback(JSON.parse(fallback));
        } else {
          callback(defaultMenuItems);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao configurar listener de produtos:', error);
      // Retornar função vazia se houver erro
      return () => {};
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

  // Criar novo produto
  async createProduct(product: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    try {
      // Buscar o próximo ID disponível
      const items = await this.getMenuItems();
      const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;

      const newProduct: MenuItem = {
        ...product,
        id: nextId,
      };

      await addDoc(collection(db, this.COLLECTION_NAME), {
        ...newProduct,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Atualizar fallback no localStorage
      const updatedItems = [...items, newProduct];
      localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(updatedItems));

      return newProduct;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // Deletar produto
  async deleteProduct(productId: number): Promise<void> {
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
        await deleteDoc(doc(db, this.COLLECTION_NAME, productDoc.id));

        // Atualizar fallback no localStorage
        const items = await this.getMenuItems();
        const updatedItems = items.filter(item => item.id !== productId);
        localStorage.setItem(this.FALLBACK_KEY, JSON.stringify(updatedItems));
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();

