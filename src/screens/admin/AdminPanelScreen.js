import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const AdminPanelScreen = ({ navigation }) => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!isAdmin()) {
      Alert.alert('Yetkisiz Erişim', 'Bu sayfaya erişim yetkiniz yok!');
      navigation.goBack();
    } else {
      loadStats();
    }
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Backend'den istatistikler çekilecek
      setStats({
        products: 25,
        orders: 12,
        users: 8,
        revenue: 15800,
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Ürünler',
      icon: 'cube-outline',
      color: '#4CAF50',
      screen: 'AdminProducts',
      description: 'Ürün ekle, düzenle, sil',
    },
    {
      id: 2,
      title: 'Siparişler',
      icon: 'receipt-outline',
      color: '#2196F3',
      screen: 'AdminOrders',
      description: 'Tüm siparişleri görüntüle',
    },
    {
      id: 3,
      title: 'Kullanıcılar',
      icon: 'people-outline',
      color: '#9C27B0',
      screen: 'AdminUsers',
      description: 'Kullanıcıları yönet',
    },
    {
      id: 4,
      title: 'İstatistikler',
      icon: 'stats-chart-outline',
      color: '#FF9800',
      screen: 'AdminStats',
      description: 'Satış ve gelir analizi',
    },
  ];

  const statCards = [
    { label: 'Ürünler', value: stats.products, icon: 'cube-outline', color: '#4CAF50' },
    { label: 'Siparişler', value: stats.orders, icon: 'receipt-outline', color: '#2196F3' },
    { label: 'Kullanıcılar', value: stats.users, icon: 'people-outline', color: '#9C27B0' },
    { label: 'Gelir (TL)', value: stats.revenue, icon: 'cash-outline', color: '#FF9800' },
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="shield-checkmark" size={40} color={COLORS.white} />
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Hoş geldiniz, {user?.name}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {statCards.map((stat, index) => (
          <View key={index} style={[styles.statCard, { borderTopColor: stat.color }]}>
            <Icon name={stat.icon} size={28} color={stat.color} />
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Yönetim İşlemleri</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Icon name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
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
    backgroundColor: COLORS.primary,
    paddingTop: SIZES.xLarge,
    paddingBottom: SIZES.xxLarge,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SIZES.small,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.white + 'CC',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.medium,
    marginTop: -30,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginHorizontal: '1%',
    marginBottom: SIZES.medium,
    alignItems: 'center',
    borderTopWidth: 4,
    ...SHADOWS.medium,
  },
  statValue: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    marginTop: SIZES.small,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 4,
  },
  menuContainer: {
    padding: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  menuDescription: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
});

export default AdminPanelScreen;
