import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

function readStoredCart() {
  try {
    const saved = localStorage.getItem('cart');
    if (!saved) {
      return [];
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }
    if (parsed.length === 0 || parsed[0].quantity !== undefined) {
      return parsed;
    }
    const grouped = {};
    parsed.forEach((product) => {
      if (grouped[product.id]) {
        grouped[product.id].quantity += 1;
      } else {
        grouped[product.id] = { ...product, quantity: 1 };
      }
    });
    return Object.values(grouped);
  } catch {
    return [];
  }
}

function persist(items) {
  localStorage.setItem('cart', JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  const addToCart = (product) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === product.id);
      const next =
        index === -1
          ? [...prev, { ...product, quantity: 1 }]
          : prev.map((item, i) =>
              i === index ? { ...item, quantity: item.quantity + 1 } : item
            );
      persist(next);
      return next;
    });
  };

  const decrementItem = (id) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      persist(next);
      return next;
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persist(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, decrementItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
