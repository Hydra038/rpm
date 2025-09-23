import { create } from 'zustand';

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
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      };
    }
    return { items: [...state.items, item] };
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
}));
