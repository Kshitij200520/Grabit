import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      console.log('🔍 CartContext SET_CART:', {
        payload: action.payload,
        items: action.payload.items,
        totalAmount: action.payload.totalAmount
      });
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
      };
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
      } else {
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          totalAmount: newItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
      }
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(
        item => item.product._id !== action.payload.productId
      );
      return {
        ...state,
        items: filteredItems,
        totalAmount: filteredItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalAmount: 0,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
  });

  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load cart data when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log('🔍 Loading cart for:', user ? 'logged user' : 'guest user');
        const response = await cartAPI.getCart();
        console.log('🔍 Cart loaded:', response.data);
        
        dispatch({
          type: 'SET_CART',
          payload: response.data || { items: [], totalAmount: 0 }
        });
      } catch (error) {
        console.log('🔍 Cart loading failed, using empty cart:', error.message);
        dispatch({
          type: 'SET_CART', 
          payload: { items: [], totalAmount: 0 }
        });
      }
    };

    loadCart();
  }, [user]);

  const setUserAndRefreshCart = async (newUser) => {
    // If user is logging out (newUser is null)
    if (!newUser) {
      // Clear guest ID so next guest gets a new cart
      localStorage.removeItem('guestId');
      // Clear the cart in the UI
      dispatch({
        type: 'CLEAR_CART'
      });
    }
    
    // Update user state
    setUser(newUser);
    
    // If user is logging in, the useEffect above will reload the cart
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Also remove token on logout
    }
  }, [user]);

  const value = {
    cartState,
    dispatch,
    user,
    setUser: setUserAndRefreshCart, // Use the new function
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
