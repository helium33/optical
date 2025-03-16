import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item, type) => set((state) => {
    const existingItem = state.cart.find((cartItem) => cartItem.id === item.id && cartItem.type === type);
    if (existingItem) {
      if (existingItem.quantity >= item.stock) {
        return state;
      }
      return {
        cart: state.cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ),
      };
    }
    return {
      cart: [...state.cart, { ...item, quantity: 1, type }],
    };
  }),
  decreaseQuantity: (id, type) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id && item.type === type && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter((item) => item.quantity > 0),
  })),
  increaseQuantity: (id, type, stock) => set((state) => {
    const item = state.cart.find((cartItem) => cartItem.id === id && cartItem.type === type);
    if (item && item.quantity >= stock) {
      return state;
    }
    return {
      cart: state.cart.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    };
  }),
  removeFromCart: (id, type) => set((state) => ({
    cart: state.cart.filter((item) => !(item.id === id && item.type === type)),
  })),
  clearCart: () => set({ cart: [] }),
  updateStock: (id, type, newStock) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id && item.type === type
        ? { ...item, stock: newStock }
        : item
    ),
  })),
}));

export default useCartStore;