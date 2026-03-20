import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { getUserFavorites, removeFavorite } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, setShowLoginModal } = useAuth();

  const loadFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserFavorites(user.id);
      if (result.success) {
        setFavorites(result.data);
      }
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemoveFavorite = async (productId) => {
    Alert.alert(
      'Favorilerden Kaldır',
      'Bu ürünü favorilerinizden kaldırmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          onPress: async () => {
            const result = await removeFavorite(user.id, productId);
            if (result.success) {
              setFavorites(favorites.filter(f => f.productId !== productId));
              Alert.alert('Başarılı', 'Ürün favorilerden kaldırıldı!');
            } else {
              Alert.alert('Hata', result.error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('ProductDetail', { product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        imageUrl: item.productImage,
        stockQuantity: 10
      } })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.productImage || 'https://via.placeholder.com/100' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={styles.productPrice}>{item.productPrice} TL</Text>
        <Text style={styles.addedDate}>
          {new Date(item.createdAt).toLocaleDateString('tr-TR')}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.productId)}
      >
        <Icon name="heart" size={24} color={COLORS.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={80} color={COLORS.gray} />
        <Text style={styles.emptyTitle}>Giriş Yapın</Text>
        <Text style={styles.emptyText}>
          Favorilerinizi görmek için giriş yapmanız gerekiyor.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setShowLoginModal(true)}
        >
          <Text style={styles.loginButtonText}>Giriş Yap / Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={80} color={COLORS.gray} />
        <Text style={styles.emptyTitle}>Favorileriniz Boş</Text>
        <Text style={styles.emptyText}>
          Beğendiğiniz ürünleri favorilere ekleyin, burada görün.
        </Text>
        <TouchableOpacity
          style={styles.shoppingButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shoppingButtonText}>Alışverişe Başla</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadFavorites();
            }}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: SIZES.medium,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.small,
  },
  productInfo: {
    flex: 1,
    marginLeft: SIZES.medium,
  },
  productName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  addedDate: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  removeButton: {
    padding: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xLarge,
  },
  emptyTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SIZES.large,
    marginBottom: SIZES.small,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.medium,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  shoppingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.medium,
  },
  shoppingButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
