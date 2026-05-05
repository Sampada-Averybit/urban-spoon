import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

const getCartStorageKey = (user) => {
  if (!user) {
    return 'urbanSpoonCart_guest';
  }

  const userId = user._id || user.id || user.email || 'user';
  return `urbanSpoonCart_${userId}`;
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const key = getCartStorageKey(user);
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Automatically write any item updates natively straight to storage
  useEffect(() => {
    const key = getCartStorageKey(user);
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = (newItem) => {
    setCartItems((prev) => {
      // Ensure each item has an identifiable ID, defaulting to name since menu utilizes name widely
      const uniqueId = newItem.id || newItem._id || newItem.name; 
      const existingItem = prev.find((item) => item.id === uniqueId);

      if (existingItem) {
        return prev.map((item) =>
          item.id === uniqueId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...newItem, id: uniqueId, _id: newItem._id || uniqueId, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Compute total raw sizing quickly
  const cartSize = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSize,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
