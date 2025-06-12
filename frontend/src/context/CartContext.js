import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], bill: 0 });
  const [loading, setLoading] = useState(false);
  const { user, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/cart/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data || { items: [], bill: 0 });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], bill: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/cart/${user.id}`, {
        productId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to add item to cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false, error: 'Please login' };

    setLoading(true);
    try {
      const response = await axios.put(`/api/cart/${user.id}`, {
        productId,
        qty: quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login' };

    setLoading(true);
    try {
      const response = await axios.delete(`/api/cart/${user.id}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to remove item' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [], bill: 0 });
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 