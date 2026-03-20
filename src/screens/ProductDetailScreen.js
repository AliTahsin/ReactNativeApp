import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkFavorite, toggleFavorite } from '../services/api';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, loading: cartLoading } = useCart();
  const { user, setShowLoginModal } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    product.imageUrl || 'https://via.placeholder.com/400',
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/400',
  ];

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user]);

  const checkFavoriteStatus = async () => {
    const result = await checkFavorite(user.id, product.id);
    if (result.success) {
      setIsFavorite(result.isFavorite);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const result = await toggleFavorite(user.id, product.id);
      if (result.success) {
        setIsFavorite(result.isFavorite);
        Alert.alert(
          'Başarılı',
          result.isFavorite ? 'Favorilere eklendi!' : 'Favorilerden kaldırıldı!'
        );
      } else {
        Alert.alert('Hata', result.error);
      }
    } catch (error) {
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu!');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: images[selectedImage] }}
            style={styles.mainImage}
          />
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? COLORS.danger : COLORS.white}
              />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {images.map((img, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(index)}
              style={[
                styles.thumbnailWrapper,
                selectedImage === index && styles.thumbnailActive,
              ]}
            >
              <Image source={{ uri: img }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category || 'Kategori'}</Text>
          <Text style={styles.name}>{product.name}</Text>
          
          <Text style={styles.price}>{product.price} TL</Text>

          <View style={styles.stockInfo}>
            <Icon
              name={product.stockQuantity > 0 ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={product.stockQuantity > 0 ? COLORS.success : COLORS.danger}
            />
            <Text
              style={[
                styles.stockText,
                { color: product.stockQuantity > 0 ? COLORS.success : COLORS.danger },
              ]}
            >
              {product.stockQuantity > 0
                ? `${product.stockQuantity} adet stokta`
                : 'Stokta yok'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
          <Text style={styles.description}>
            {product.description ||
              'Ürün açıklaması bulunmuyor. Buraya ürünle ilgili detaylı bilgiler gelecek.'}
          </Text>

          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.features}>
            {[
              '1 yıl garanti',
              'Ücretsiz kargo',
              'İade garantisi',
              'Orijinal ürün',
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="checkmark-circle" size={18} color={COLORS.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={decreaseQuantity}
            style={styles.quantityButton}
            disabled={quantity <= 1}
          >
            <Icon name="remove" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={increaseQuantity}
            style={styles.quantityButton}
          >
            <Icon name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addButton, cartLoading && styles.disabledButton]}
          onPress={handleAddToCart}
          disabled={cartLoading || product.stockQuantity === 0}
        >
          {cartLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Icon name="cart-outline" size={20} color={COLORS.white} />
              <Text style={styles.addButtonText}>Sepete Ekle</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: SIZES.large,
    left: SIZES.large,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.large,
    right: SIZES.large,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
  },
  thumbnailWrapper: {
    marginRight: SIZES.small,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: SIZES.small,
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: COLORS.primary,
  },
  thumbnail: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  content: {
    padding: SIZES.medium,
  },
  category: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  price: {
    fontSize: SIZES.xxxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  stockText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SIZES.large,
    marginBottom: SIZES.small,
  },
  description: {
    fontSize: SIZES.medium,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  features: {
    marginTop: SIZES.small,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  featureText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: SIZES.medium,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  addButtonText: {
    marginLeft: SIZES.small,
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
