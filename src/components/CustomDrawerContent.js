import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const CustomDrawerContent = (props) => {
  const { user, setShowLoginModal, logout, isAdmin } = useAuth();

  const handleLoginPress = () => {
    setShowLoginModal(true);
  };

  const handleLogoutPress = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        {/* Profil Bölümü */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user ? user.name?.charAt(0) || 'A' : 'M'}
              </Text>
            </View>
            {user && isAdmin() && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>
            {user ? user.name : 'Misafir'}
          </Text>
          <Text style={styles.userEmail}>
            {user ? user.email : 'Giriş yapmadınız'}
          </Text>
          
          {!user ? (
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
              <Icon name="log-in-outline" size={20} color={COLORS.white} />
              <Text style={styles.loginButtonText}>Giriş Yap / Kayıt Ol</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
              <Icon name="log-out-outline" size={20} color={COLORS.danger} />
              <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {/* Ana Menü Öğeleri */}
        <DrawerItem
          label="Anasayfa"
          icon={({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Anasayfa')}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Favoriler"
          icon={({ color, size }) => (
            <Icon name="heart-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Favoriler')}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Sepetim"
          icon={({ color, size }) => (
            <Icon name="cart-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Sepetim')}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
        
        <DrawerItem
          label="Profilim"
          icon={({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Profilim')}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />

        {user && (
          <>
            <View style={styles.divider} />
            <DrawerItem
              label="Siparişlerim"
              icon={({ color, size }) => (
                <Icon name="receipt-outline" size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate('Profilim', { screen: 'Orders' })}
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
            />
          </>
        )}

        {isAdmin() && (
          <>
            <View style={styles.divider} />
            <Text style={styles.adminSectionTitle}>Yönetim</Text>
            <DrawerItem
              label="Admin Paneli"
              icon={({ color, size }) => (
                <Icon name="shield-checkmark-outline" size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate('Profilim', { screen: 'AdminPanel' })}
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
            />
            <DrawerItem
              label="Ürün Yönetimi"
              icon={({ color, size }) => (
                <Icon name="cube-outline" size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate('Profilim', { screen: 'AdminProducts' })}
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
            />
            <DrawerItem
              label="Sipariş Yönetimi"
              icon={({ color, size }) => (
                <Icon name="receipt-outline" size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate('Profilim', { screen: 'AdminOrders' })}
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
            />
          </>
        )}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Versiyon 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flexGrow: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SIZES.xLarge,
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.small,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.warning,
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
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SIZES.small,
  },
  userEmail: {
    fontSize: SIZES.small,
    color: COLORS.white + 'CC',
    marginBottom: SIZES.medium,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    gap: SIZES.small,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    gap: SIZES.small,
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.small,
  },
  drawerItem: {
    borderRadius: 0,
    marginVertical: 2,
  },
  drawerLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  adminSectionTitle: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginTop: SIZES.small,
    marginBottom: SIZES.small,
    paddingHorizontal: SIZES.medium,
  },
  footer: {
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  versionText: {
    textAlign: 'center',
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});

export default CustomDrawerContent;
