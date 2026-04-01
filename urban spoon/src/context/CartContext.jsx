import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize from localized storage to sustain sessions naturally
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('urbanSpoonCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Automatically write any item updates natively straight to storage
  useEffect(() => {
    localStorage.setItem('urbanSpoonCart', JSON.stringify(cartItems));
  }, [cartItems]);

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
