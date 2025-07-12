import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INCREMENT_ITEM'; payload: number }
  | { type: 'DECREMENT_ITEM'; payload: number };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
          itemCount: state.itemCount + 1
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
        itemCount: state.itemCount + 1
      };
    }
    
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload);
      if (!item) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity),
        itemCount: state.itemCount - item.quantity
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;
      
      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
        itemCount: state.itemCount + quantityDiff
      };
    }
    
    case 'INCREMENT_ITEM': {
      const item = state.items.find(item => item.id === action.payload);
      if (!item) return state;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
        total: state.total + item.price,
        itemCount: state.itemCount + 1
      };
    }
    
    case 'DECREMENT_ITEM': {
      const item = state.items.find(item => item.id === action.payload);
      if (!item) return state;
      
      if (item.quantity <= 1) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload),
          total: state.total - item.price,
          itemCount: state.itemCount - 1
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
        total: state.total - item.price,
        itemCount: state.itemCount - 1
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const incrementItem = (id: number) => {
    dispatch({ type: 'INCREMENT_ITEM', payload: id });
  };

  const decrementItem = (id: number) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: number) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      incrementItem,
      decrementItem,
      clearCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}; 