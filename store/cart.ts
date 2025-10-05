import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  validateCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => set((state) => {
        // Validate item ID before adding
        const id = item.id?.toString();
        if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
          console.error('Invalid item ID:', item.id);
          return state; // Don't add invalid items
        }

        const existing = state.items.find((i) => i.id === id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, id }] };
      }),
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        ),
      })),
      clearCart: () => set({ items: [] }),
      validateCart: () => set((state) => ({
        items: state.items.filter((item) => {
          const id = parseInt(item.id);
          return !isNaN(id) && id > 0 && item.quantity > 0 && item.price >= 0;
        })
      })),
    }),
    {
      name: 'rpm-cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);
