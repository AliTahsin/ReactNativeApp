import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, requireAuth, setShowLoginModal } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        'Giriş Gerekli',
        'Sipariş vermek için giriş yapmanız gerekiyor.',
        [
          { text: 'İptal', style: 'cancel' },
          { 
            text: 'Giriş Yap', 
            onPress: () => setShowLoginModal(true) 
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Siparişi Tamamla',
      `Toplam: ${total} TL\nSiparişinizi tamamlamak istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Onayla',
          onPress: () => {
            Alert.alert('Başarılı', 'Siparişiniz alındı!');
            clearCart();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
      />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>{item.price} TL</Text>
        
        <View style={styles.itemFooter}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Icon name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Icon name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.itemTotal}>
            {item.price * item.quantity} TL
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={() => removeFromCart(item.id)}
        style={styles.removeButton}
      >
        <Icon name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="cart-outline" size={80} color={COLORS.gray} />
        <Text style={styles.emptyTitle}>Sepetiniz boş</Text>
        <Text style={styles.emptyText}>
          Alışverişe başlamak için ürünleri keşfedin
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
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Ara Toplam</Text>
          <Text style={styles.totalAmount}>{total} TL</Text>
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Kargo</Text>
          <Text style={styles.shippingText}>Ücretsiz</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalContainer}>
          <Text style={styles.grandTotalLabel}>Toplam</Text>
          <Text style={styles.grandTotalAmount}>{total} TL</Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>
            {user ? 'Siparişi Tamamla' : 'Sipariş Vermek İçin Giriş Yap'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearText}>Sepeti Temizle</Text>
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
  shoppingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xLarge,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.medium,
  },
  shoppingButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  list: {
    padding: SIZES.medium,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.small,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SIZES.medium,
  },
  itemName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SIZES.small,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  removeButton: {
    padding: SIZES.small,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  totalLabel: {
    fontSize: SIZES.medium,
    color: COLORS.textLight,
  },
  totalAmount: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  shippingText: {
    fontSize: SIZES.medium,
    color: COLORS.success,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.small,
  },
  grandTotalLabel: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  grandTotalAmount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.small,
    ...SHADOWS.small,
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  clearText: {
    color: COLORS.danger,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
});

export default CartScreen;
