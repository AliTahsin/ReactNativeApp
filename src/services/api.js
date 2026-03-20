import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Yeni port: 5006
const API_URL = 'http://localhost:5006/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı otomatik ekle
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('API Hatası - Ürünler:', error.message);
    return [];
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('API Hatası - Ürün Detay:', error.message);
    return null;
  }
};

export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await api.post('/cart/add', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error('API Hatası - Sepete Ekle:', error.message);
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('API Hatası - Sepet:', error.message);
    return { items: [], totalPrice: 0 };
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    await api.delete(`/cart/item/${cartItemId}`);
  } catch (error) {
    console.error('API Hatası - Sepetten Çıkar:', error.message);
    throw error;
  }
};

export const clearCart = async (userId) => {
  try {
    await api.delete(`/cart/clear/${userId}`);
  } catch (error) {
    console.error('API Hatası - Sepet Temizle:', error.message);
    throw error;
  }
};

// Auth servisleri
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Kayıt başarısız!' 
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...user } = response.data;
    
    await AsyncStorage.setItem('@auth_token', token);
    await AsyncStorage.setItem('@user', JSON.stringify(user));
    
    return { success: true, user, token };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Giriş başarısız!' 
    };
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('@auth_token');
  await AsyncStorage.removeItem('@user');
};

export default api;

// Favori servisleri
export const addFavorite = async (userId, productId) => {
  try {
    const response = await api.post('/favorite/add', { userId, productId });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Favori eklenemedi!' };
  }
};

export const removeFavorite = async (userId, productId) => {
  try {
    const response = await api.delete('/favorite/remove', { 
      data: { userId, productId } 
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Favori kaldırılamadı!' };
  }
};

export const toggleFavorite = async (userId, productId) => {
  try {
    const response = await api.post('/favorite/toggle', { userId, productId });
    return { success: true, isFavorite: response.data.isFavorite };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'İşlem başarısız!' };
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const response = await api.get(`/favorite/user/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Favoriler yüklenemedi!', data: [] };
  }
};

export const checkFavorite = async (userId, productId) => {
  try {
    const response = await api.get(`/favorite/check/${userId}/${productId}`);
    return { success: true, isFavorite: response.data.isFavorite };
  } catch (error) {
    return { success: false, isFavorite: false };
  }
};

export const getFavoriteCount = async (userId) => {
  try {
    const response = await api.get(`/favorite/count/${userId}`);
    return { success: true, count: response.data.count };
  } catch (error) {
    return { success: false, count: 0 };
  }
};

// Ürün arama
export const searchProducts = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.minStock) queryParams.append('minStock', params.minStock);
    
    const url = `/products/search?${queryParams.toString()}`;
    const response = await api.get(url);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Arama hatası:', error.message);
    return { success: false, data: [], error: error.message };
  }
};

// AI Öneri servisleri
export const getUserRecommendations = async (userId, count = 5) => {
  try {
    const response = await api.get(`/ai/recommendations/user/${userId}?count=${count}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Öneriler yüklenirken hata:', error.message);
    return { success: false, data: [] };
  }
};

export const getSimilarProducts = async (productId, count = 5) => {
  try {
    const response = await api.get(`/ai/recommendations/similar/${productId}?count=${count}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Benzer ürünler yüklenirken hata:', error.message);
    return { success: false, data: [] };
  }
};

export const updateProductRating = async (userId, productId, rating) => {
  try {
    const response = await api.post('/ai/rating', { userId, productId, rating });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Puan gönderilirken hata:', error.message);
    return { success: false };
  }
};
