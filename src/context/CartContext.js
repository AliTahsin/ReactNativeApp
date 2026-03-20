import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/api';

const CartContext = createContext();
const USER_ID = 'guest-1'; // Şimdilik sabit kullanıcı

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    try {
      const data = await getCart(USER_ID);
      if (data && data.items) {
        setCartItems(data.items);
        setTotal(data.totalPrice || 0);
      }
    } catch (error) {
      console.error('Sepet yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    try {
      await apiAddToCart(USER_ID, product.id, quantity);
      await loadCart();
      Alert.alert('Başarılı', `${product.name} sepete eklendi!`);
    } catch (error) {
      Alert.alert('Hata', 'Ürün sepete eklenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    try {
      await apiRemoveFromCart(cartItemId);
      await loadCart();
      Alert.alert('Başarılı', 'Ürün sepetten çıkarıldı!');
    } catch (error) {
      Alert.alert('Hata', 'Ürün çıkarılırken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    // Backend'de direkt quantity güncelleme endpoint'i yoksa,
    // önce silip tekrar ekleyebiliriz
    const item = cartItems.find(i => i.productId === productId);
    if (item) {
      await removeFromCart(item.id);
      if (newQuantity > 0) {
        // Ürün bilgisini alıp tekrar eklemek gerekir
        // Şimdilik direkt ekleme yapmıyoruz
      }
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiClearCart(USER_ID);
      setCartItems([]);
      setTotal(0);
      Alert.alert('Başarılı', 'Sepet temizlendi!');
    } catch (error) {
      Alert.alert('Hata', 'Sepet temizlenirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
