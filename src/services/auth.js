import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api';

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı AsyncStorage'a kaydet
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@auth_token', token);
  } catch (error) {
    console.error('Token kaydedilemedi:', error);
  }
};

// Token'ı AsyncStorage'dan al
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (error) {
    console.error('Token alınamadı:', error);
    return null;
  }
};

// Token'ı sil (çıkış yap)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('@auth_token');
  } catch (error) {
    console.error('Token silinemedi:', error);
  }
};

// Kullanıcı bilgilerini kaydet
export const storeUser = async (user) => {
  try {
    await AsyncStorage.setItem('@user', JSON.stringify(user));
  } catch (error) {
    console.error('Kullanıcı kaydedilemedi:', error);
  }
};

// Kullanıcı bilgilerini al
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('@user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Kullanıcı alınamadı:', error);
    return null;
  }
};

// Giriş yap
export const login = async (email, password) => {
  try {
    const response = await authApi.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    await storeToken(token);
    await storeUser(user);
    
    return { success: true, user, token };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Giriş başarısız!' 
    };
  }
};

// Kayıt ol
export const register = async (userData) => {
  try {
    const response = await authApi.post('/auth/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Kayıt başarısız!' 
    };
  }
};

// Çıkış yap
export const logout = async () => {
  await removeToken();
  await AsyncStorage.removeItem('@user');
};

export default authApi;
