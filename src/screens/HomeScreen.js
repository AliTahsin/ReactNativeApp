import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { searchProducts, getUserRecommendations } from '../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const categories = [
    { id: 'all', name: 'Tümü', icon: 'apps' },
    { id: 'electronics', name: 'Elektronik', icon: 'laptop' },
    { id: 'clothing', name: 'Giyim', icon: 'shirt' },
    { id: 'books', name: 'Kitap', icon: 'book' },
  ];

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.keyword = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      
      const result = await searchProducts(params);
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedCategory]);

  const loadRecommendations = useCallback(async () => {
    if (!user) return;
    try {
      const result = await getUserRecommendations(user.id, 5);
      if (result.success) {
        setRecommendations(result.data);
      }
    } catch (error) {
      console.error('Öneriler yüklenirken hata:', error);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
    loadRecommendations();
  }, [loadProducts, loadRecommendations]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
    loadRecommendations();
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/200' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price} TL</Text>
        <View style={styles.productFooter}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Stok: {item.stockQuantity}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(item, 1)}
          >
            <Icon name="cart-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon
        name={item.icon}
        size={20}
        color={selectedCategory === item.id ? COLORS.white : COLORS.primary}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRecommendation = ({ item }) => (
    <TouchableOpacity
      style={styles.recommendationCard}
      onPress={() => navigation.navigate('ProductDetail', { product: {
        id: item.productId,
        name: item.productName,
        price: item.price,
        imageUrl: item.imageUrl,
        stockQuantity: 10
      } })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }}
        style={styles.recommendationImage}
      />
      <View style={styles.recommendationInfo}>
        <Text style={styles.recommendationName} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={styles.recommendationPrice}>{item.price} TL</Text>
        <View style={styles.scoreBadge}>
          <Icon name="star" size={12} color={COLORS.warning} />
          <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu-outline" size={28} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI E-Ticaret</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sepetim')}>
          <Icon name="cart-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ürün ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={loadProducts}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Kategoriler */}
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* AI Öneriler */}
      {user && recommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔍 Sana Özel Öneriler</Text>
          </View>
          <FlatList
            horizontal
            data={recommendations}
            renderItem={renderRecommendation}
            keyExtractor={(item) => item.productId.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsList}
          />
        </View>
      )}

      {/* Ürün Listesi */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `"${searchQuery}" için sonuçlar` : 'Tüm Ürünler'}
          </Text>
        </View>
        
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="sad-outline" size={60} color={COLORS.gray} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'Ürün bulunamadı' : 'Ürün yok'}
              </Text>
            </View>
          }
        />
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    paddingTop: SIZES.large,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.medium,
    marginVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.text,
    padding: 0,
  },
  categoriesContainer: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    gap: SIZES.small,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.medium,
    marginRight: SIZES.small,
    ...SHADOWS.small,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    marginLeft: 4,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  section: {
    marginTop: SIZES.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.small,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  recommendationsList: {
    paddingLeft: SIZES.medium,
    paddingRight: SIZES.small,
    gap: SIZES.small,
  },
  recommendationCard: {
    width: 160,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    marginRight: SIZES.small,
    padding: SIZES.small,
    ...SHADOWS.small,
  },
  recommendationImage: {
    width: '100%',
    height: 120,
    borderRadius: SIZES.small,
    resizeMode: 'cover',
  },
  recommendationInfo: {
    marginTop: SIZES.small,
  },
  recommendationName: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: SIZES.small,
    color: COLORS.warning,
    fontWeight: 'bold',
  },
  productList: {
    padding: SIZES.medium,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: SIZES.small,
  },
  productName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockBadge: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SIZES.small,
    paddingVertical: 2,
    borderRadius: SIZES.small,
  },
  stockText: {
    fontSize: SIZES.small,
    color: COLORS.primaryDark,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxxLarge,
  },
  emptyText: {
    marginTop: SIZES.medium,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
});

export default HomeScreen;
