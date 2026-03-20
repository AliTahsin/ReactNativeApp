import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const statusOptions = [
    { id: 'Pending', label: 'Beklemede', color: '#FF9800' },
    { id: 'Confirmed', label: 'Onaylandı', color: '#2196F3' },
    { id: 'Shipped', label: 'Kargoya Verildi', color: '#9C27B0' },
    { id: 'Delivered', label: 'Teslim Edildi', color: '#4CAF50' },
    { id: 'Cancelled', label: 'İptal Edildi', color: '#f44336' },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Backend'den siparişler çekilecek
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-20260320-0001',
          userName: 'Ali Tahsin',
          totalAmount: 15800,
          status: 'Pending',
          paymentStatus: 'Paid',
          orderDate: '2026-03-20',
          items: [{ name: 'Laptop', quantity: 1, price: 15000 }],
        },
        {
          id: 2,
          orderNumber: 'ORD-20260320-0002',
          userName: 'Test User',
          totalAmount: 1300,
          status: 'Shipped',
          paymentStatus: 'Paid',
          orderDate: '2026-03-20',
          items: [{ name: 'Mouse', quantity: 2, price: 500 }, { name: 'Klavye', quantity: 1, price: 800 }],
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      Alert.alert('Hata', 'Siparişler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Backend durum güncelleme
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      Alert.alert('Başarılı', 'Sipariş durumu güncellendi!');
    } catch (error) {
      Alert.alert('Hata', 'Durum güncellenirken hata oluştu!');
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(s => s.id === status);
    return option ? option.color : COLORS.gray;
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(s => s.id === status);
    return option ? option.label : status;
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.orderDate}>{item.orderDate}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>{item.totalAmount} TL</Text>
        <Icon name="chevron-forward" size={20} color={COLORS.gray} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Sipariş Yönetimi</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sipariş Detayı</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView style={styles.modalContent}>
                <Text style={styles.detailLabel}>Sipariş No</Text>
                <Text style={styles.detailValue}>{selectedOrder.orderNumber}</Text>

                <Text style={styles.detailLabel}>Müşteri</Text>
                <Text style={styles.detailValue}>{selectedOrder.userName}</Text>

                <Text style={styles.detailLabel}>Tarih</Text>
                <Text style={styles.detailValue}>{selectedOrder.orderDate}</Text>

                <Text style={styles.detailLabel}>Ürünler</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    <Text style={styles.itemPrice}>{item.price} TL</Text>
                  </View>
                ))}

                <Text style={styles.detailLabel}>Toplam</Text>
                <Text style={styles.totalAmountLarge}>{selectedOrder.totalAmount} TL</Text>

                <Text style={styles.detailLabel}>Durum Güncelle</Text>
                <View style={styles.statusOptions}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.statusOption,
                        selectedOrder.status === option.id && styles.statusOptionActive,
                      ]}
                      onPress={() => {
                        updateOrderStatus(selectedOrder.id, option.id);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          selectedOrder.status === option.id && styles.statusOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backButton: {
    padding: SIZES.small,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  list: {
    padding: SIZES.medium,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  orderNumber: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.small,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  userName: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginBottom: SIZES.small,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  totalAmount: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.medium,
    borderRadius: SIZES.medium,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalContent: {
    padding: SIZES.medium,
  },
  detailLabel: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: SIZES.medium,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: SIZES.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    flex: 2,
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  itemPrice: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.primary,
  },
  totalAmountLarge: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.small,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.small,
    marginTop: SIZES.small,
  },
  statusOption: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: SIZES.small,
    color: COLORS.text,
  },
  statusOptionTextActive: {
    color: COLORS.white,
  },
});

export default AdminOrdersScreen;
