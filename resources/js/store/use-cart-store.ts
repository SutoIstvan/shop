import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartProduct {
  id: number | string;
  name: string;
  slug: string;
  price: number | string;
  images?: string[];
}

export interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          // Generate a unique cart item id base on product id
          const newItemId = `cart_item_${product.id}`;
          return {
            items: [...state.items, { id: newItemId, product, quantity }],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== itemId) };
          }
          
          return {
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.product.price) * item.quantity,
          0
        );
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'petdo-cart-storage', // key in local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
