import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import shopService from '../services/shopService';
import authService from '../services/authService';

export default function ShopScreen({ navigation }) {
    const { user, login, updateUser } = useAuth();
    const { activeFont } = useTheme();
    const [items, setItems] = useState({ themes: [], fonts: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('themes'); // themes | fonts
    const [buying, setBuying] = useState(null);

    useEffect(() => {
        fetchShopItems();
    }, []);

    const fetchShopItems = async () => {
        try {
            const data = await shopService.getShopItems();
            if (data.success) {
                setItems(data.data.catalog);
                // Sync user coins and equipped items
                updateUser({
                    coins: data.data.coins,
                    equipped_theme: data.data.equipped.theme,
                    equipped_font: data.data.equipped.font
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load shop items');
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (item) => {
        if (user.coins < item.price) {
            Alert.alert('Insufficient Coins', 'You earn coins by searching for weather!');
            return;
        }

        try {
            setBuying(item.id);
            const response = await shopService.buyItem(item.id, item.type);
            if (response.success) {
                Alert.alert('Success', `You purchased ${item.name}!`);
                // Update coins locally immediately
                updateUser({ coins: response.data.coins });
                fetchShopItems(); // Refresh list ownership
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Purchase failed');
        } finally {
            setBuying(null);
        }
    };

    const handleEquip = async (item) => {
        try {
            setBuying(item.id);
            const response = await shopService.equipItem(item.id, item.type);
            if (response.success) {
                Alert.alert('Success', 'Item equipped!');
                // Update context
                updateUser({
                    equipped_theme: response.data.user.equipped_theme,
                    equipped_font: response.data.user.equipped_font
                });
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Equip failed');
        } finally {
            setBuying(null);
        }
    };

    const renderItem = ({ item }) => {
        const isOwned = item.owned;
        const isEquipped = (item.type === 'theme' && user.equipped_theme === item.id) ||
            (item.type === 'font' && user.equipped_font === item.id);

        return (
            <View style={styles.card}>
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { fontFamily: activeFont }]}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price > 0 ? `${item.price} 🪙` : 'Free'}</Text>
                </View>

                {/* Preview */}
                {item.type === 'theme' && (
                    <View style={styles.previewContainer}>
                        <View style={[styles.colorPreview, { backgroundColor: item.value.start }]} />
                        <View style={[styles.colorPreview, { backgroundColor: item.value.end }]} />
                    </View>
                )}
                {item.type === 'font' && (
                    <Text style={[styles.fontPreview, { fontFamily: item.value === 'System' ? undefined : item.value }]}>
                        Abc
                    </Text>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    {!isOwned ? (
                        <TouchableOpacity
                            style={[styles.button, styles.buyButton]}
                            onPress={() => handleBuy(item)}
                            disabled={buying === item.id}
                        >
                            <Text style={styles.buttonText}>Buy</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, isEquipped ? styles.equippedButton : styles.equipButton]}
                            onPress={() => !isEquipped && handleEquip(item)}
                            disabled={isEquipped || buying === item.id}
                        >
                            <Text style={styles.buttonText}>
                                {isEquipped ? 'Equipped' : 'Equip'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <GradientBackground>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shop</Text>
                <View style={styles.coinContainer}>
                    <Text style={styles.coinText}>{user?.coins || 0} 🪙</Text>
                </View>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'themes' && styles.activeTab]}
                    onPress={() => setActiveTab('themes')}
                >
                    <Text style={styles.tabText}>Themes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'fonts' && styles.activeTab]}
                    onPress={() => setActiveTab('fonts')}
                >
                    <Text style={styles.tabText}>Fonts</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <FlatList
                    data={items[activeTab]}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    coinContainer: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    coinText: {
        color: '#ffd700',
        fontWeight: 'bold',
        fontSize: 16,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#fff',
    },
    tabText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemPrice: {
        color: '#aaa',
        marginTop: 4,
    },
    previewContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    colorPreview: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginLeft: -5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    fontPreview: {
        color: '#fff',
        fontSize: 20,
        marginHorizontal: 10,
    },
    actions: {
        width: 100,
    },
    button: {
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    buyButton: {
        backgroundColor: '#4ecdc4',
    },
    equipButton: {
        backgroundColor: '#667eea',
    },
    equippedButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
