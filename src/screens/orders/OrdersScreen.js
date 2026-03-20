import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Tümü' },
    { id: 'pending', name: 'Hazırlanıyor' },
    { id: 'shipped', name: 'Kargoda' },
    { id: 'delivered', name: 'Teslim Edildi' },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Simüle edilmiş sipariş verileri
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          date: '2026-03-15',
          status: 'delivered',
          statusText: 'Teslim Edildi',
          total: 15000,
          items: [
            { id: 1, name: 'Laptop', quantity: 1, price: 15000, image: 'https://via.placeholder.com/60' }
          ]
        },
        {
          id: 'ORD-002',
          date: '2026-03-14',
          status: 'shipped',
          statusText: 'Kargoda',
          total: 1300,
          items: [
            { id: 2, name: 'Mouse', quantity: 2, price: 500, image: 'https://via.placeholder.com/60' },
            { id: 3, name: 'Klavye', quantity: 1, price: 800, image: 'https://via.placeholder.com/60' }
          ]
        },
        {
          id: 'ORD-003',
          date: '2026-03-10',
          status: 'pending',
          statusText: 'Hazırlanıyor',
          total: 2000,
          items: [
            { id: 4, name: 'Kulaklık', quantity: 1, price: 1200, image: 'https://via.placeholder.com/60' },
            { id: 5, name: 'USB Bellek', quantity: 2, price: 400, image: 'https://via.placeholder.com/60' }
          ]
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return COLORS.success;
      case 'shipped': return COLORS.info;
      case 'pending': return COLORS.warning;
      default: return COLORS.gray;
    }
  };

  const filterOrders = () => {
    if (selectedFilter === 'all') return orders;
    return orders.filter(order => order.status === selectedFilter);
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.statusText}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.itemRow}>
            <Image source={{ uri: product.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.itemQuantity}>Adet: {product.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>{product.price} TL</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Toplam:</Text>
        <Text style={styles.totalAmount}>{item.total} TL</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="repeat-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Tekrar Sipariş Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="document-text-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Fatura</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        selectedFilter === item.id && styles.filterItemActive
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === item.id && styles.filterTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const filteredOrders = filterOrders();

  return (
    <View style={styles.container}>
      {/* Filtreler */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          renderItem={renderFilter}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Sipariş Listesi */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="document-text-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>Siparişiniz yok</Text>
          <Text style={styles.emptyText}>
            Henüz hiç sipariş vermemişsiniz. Alışverişe başlayın.
          </Text>
          <TouchableOpacity
            style={styles.shoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shoppingButtonText}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      )}
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
  filtersContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.small,
    ...SHADOWS.small,
  },
  filtersList: {
    paddingHorizontal: SIZES.medium,
    gap: SIZES.small,
  },
  filterItem: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.medium,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  list: {
    padding: SIZES.medium,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  orderId: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.small,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.small,
    marginBottom: SIZES.small,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.primary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.small,
    marginBottom: SIZES.small,
  },
  totalLabel: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.small,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.small,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: '600',
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
});

export default OrdersScreen;
