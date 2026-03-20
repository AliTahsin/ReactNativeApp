import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, setShowLoginModal, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleMenuPress = (screen) => {
    if (!user && screen !== 'Login') {
      setShowLoginModal(true);
      return;
    }
    if (screen === 'Orders') {
      navigation.navigate('Orders');
    } else if (screen === 'Favorites') {
      navigation.navigate('Favorites');
    } else if (screen === 'Login') {
      setShowLoginModal(true);
    } else {
      Alert.alert('Bilgi', `${screen} ekranı yakında eklenecek!`);
    }
  };

  const menuItems = [
    { id: 1, name: 'Siparişlerim', icon: 'receipt-outline', screen: 'Orders', requiresAuth: true },
    { id: 2, name: 'Favorilerim', icon: 'heart-outline', screen: 'Favorites', requiresAuth: true },
    { id: 3, name: 'Adreslerim', icon: 'location-outline', screen: 'Addresses', requiresAuth: true },
    { id: 4, name: 'Ödeme Yöntemleri', icon: 'card-outline', screen: 'Payments', requiresAuth: true },
    { id: 5, name: 'Ayarlar', icon: 'settings-outline', screen: 'Settings', requiresAuth: false },
  ];

  if (!user) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Icon name="person" size={60} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.userName}>Misafir</Text>
          <Text style={styles.userEmail}>Giriş yapmadınız</Text>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => setShowLoginModal(true)}
          >
            <Text style={styles.loginButtonText}>Giriş Yap / Kayıt Ol</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
      {isAdmin() && (
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => navigation.navigate("AdminPanel")}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight + "20" }]}>
              <Icon name="shield-checkmark" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuItemText}>Admin Paneli</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      )}
          <Text style={styles.sectionTitle}>Menü</Text>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight + '20' }]}>
                  <Icon name={item.icon} size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.menuItemText}>{item.name}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {user?.name?.charAt(0) || 'A'}
            </Text>
          </View>
          {isAdmin() && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Sipariş</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Kupon</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>250</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
      {isAdmin() && (
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => navigation.navigate("AdminPanel")}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight + "20" }]}>
              <Icon name="shield-checkmark" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuItemText}>Admin Paneli</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      )}
        <Text style={styles.sectionTitle}>Hesabım</Text>
        {menuItems.slice(0, 4).map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.screen)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight + '20' }]}>
                <Icon name={item.icon} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuItemText}>{item.name}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.menuSection}>
      {isAdmin() && (
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => navigation.navigate("AdminPanel")}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight + "20" }]}>
              <Icon name="shield-checkmark" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuItemText}>Admin Paneli</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      )}
        <Text style={styles.sectionTitle}>Diğer</Text>
        {menuItems.slice(4).map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => handleMenuPress(item.screen)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.secondaryLight + '20' }]}>
                <Icon name={item.icon} size={20} color={COLORS.secondary} />
              </View>
              <Text style={styles.menuItemText}>{item.name}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color={COLORS.danger} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Versiyon 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: SIZES.large,
    paddingBottom: SIZES.xLarge,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SIZES.small,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.small,
  },
  adminBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginBottom: SIZES.medium,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: SIZES.large,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.medium,
    paddingVertical: SIZES.small,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.textLight,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  menuItemText: {
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginTop: SIZES.large,
    marginHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.small,
    ...SHADOWS.small,
    gap: SIZES.small,
  },
  logoutText: {
    fontSize: SIZES.medium,
    color: COLORS.danger,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginVertical: SIZES.large,
  },
});

export default ProfileScreen;
