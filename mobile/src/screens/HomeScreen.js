import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    Animated,
    Keyboard,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import GradientBackground from '../components/GradientBackground';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import weatherService from '../services/weatherService';
import theme from '../styles/theme';
import RewardModal from '../components/RewardModal';

/**
 * Home Screen
 * Main weather display with current conditions and forecast
 */
const HomeScreen = ({ navigation }) => {
    const { user, logout, updateUser } = useAuth();
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [searchCity, setSearchCity] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Reward Modal
    const [rewardVisible, setRewardVisible] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const searchAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadWeatherData();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        Animated.timing(searchAnim, {
            toValue: showSearch ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [showSearch]);

    const loadWeatherData = async (city = null) => {
        try {
            setError(null);

            let params = {};

            if (city) {
                params = { city };
            } else {
                // Try to get user's location
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status === 'granted') {
                    const location = await Location.getCurrentPositionAsync({});
                    params = {
                        lat: location.coords.latitude,
                        lon: location.coords.longitude,
                    };
                } else {
                    // Default to London if no permission
                    params = { city: 'London' };
                }
            }

            // Fetch current weather
            const weatherResult = await weatherService.getCurrentWeather(params);
            if (weatherResult.success) {
                setWeather(weatherResult.data);

                // Check for rewards
                if (weatherResult.meta?.reward?.coinsEarned > 0) {
                    // Update global user state (coins)
                    if (updateUser) {
                        updateUser({ coins: weatherResult.meta.reward.totalCoins });
                    }

                    // Show Huge Reward Modal
                    setRewardAmount(weatherResult.meta.reward.coinsEarned);
                    setRewardVisible(true);
                }
            } else {
                setError(weatherResult.message);
            }

            // Fetch forecast
            const forecastResult = await weatherService.getForecast(params);
            if (forecastResult.success) {
                setForecast(forecastResult.data);
            }

        } catch (err) {
            console.error('Weather load error:', err);
            setError('Failed to load weather data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadWeatherData(weather?.city);
    };

    const handleSearch = () => {
        if (searchCity.trim()) {
            setLoading(true);
            loadWeatherData(searchCity.trim());
            setSearchCity('');
            setShowSearch(false);
            Keyboard.dismiss();
        }
    };

    const handleLogout = () => {
        logout();
    };

    const searchHeight = searchAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
    });

    if (loading && !weather) {
        return (
            <GradientBackground>
                <StatusBar style="light" />
                <LoadingSpinner message="Fetching weather data..." />
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <StatusBar style="light" />

            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.username || 'User'}!</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Text style={styles.date}>
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </Text>
                            <View style={{ marginLeft: 10, backgroundColor: 'rgba(255,215,0,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                                <Text style={{ color: '#ffd700', fontWeight: 'bold' }}>{user?.coins || 0} 🪙</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerButtons}>
                        {/* Admin Button */}
                        {(user?.is_admin === 1 || user?.is_admin === true) && (
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => navigation.navigate('AdminDashboard')}
                            >
                                <Ionicons name="shield-checkmark" size={20} color="#fff" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('Shop')}
                        >
                            <Ionicons name="cart" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('Leaderboard')}
                        >
                            <Ionicons name="trophy" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setShowSearch(!showSearch)}
                        >
                            <Ionicons name="search" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar (Animated) */}
                <Animated.View style={[styles.searchContainer, { height: searchHeight, opacity: searchAnim }]}>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search city..."
                            placeholderTextColor={theme.colors.text.muted}
                            value={searchCity}
                            onChangeText={setSearchCity}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Text style={styles.searchButtonText}>Go</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.colors.primary.start}
                            colors={[theme.colors.primary.start]}
                        />
                    }
                >
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorEmoji}>😔</Text>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={() => loadWeatherData('London')}
                            >
                                <Text style={styles.retryText}>Try London</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {/* Current Weather */}
                            <WeatherCard weather={weather} isMain />

                            {/* 5-Day Forecast */}
                            <ForecastCard forecast={forecast} />

                            {/* Additional Info */}
                            {weather && (
                                <View style={styles.additionalInfo}>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoEmoji}>🌅</Text>
                                            <Text style={styles.infoLabel}>Sunrise</Text>
                                            <Text style={styles.infoValue}>
                                                {new Date(weather.sunrise).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoEmoji}>🌇</Text>
                                            <Text style={styles.infoLabel}>Sunset</Text>
                                            <Text style={styles.infoValue}>
                                                {new Date(weather.sunset).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {/* Bottom spacing */}
                    {/* Logout Button (Bottom) */}
                    <TouchableOpacity style={styles.logoutButtonFooter} onPress={handleLogout}>
                        <Text style={styles.logoutTextFooter}>Log Out</Text>
                        <Ionicons name="log-out-outline" size={20} color="#ff6b6b" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <View style={{ height: 20 }} />
                </ScrollView>

                {/* Reward Modal */}
                <RewardModal
                    visible={rewardVisible}
                    amount={rewardAmount}
                    totalCoins={user?.coins || 0}
                    onClose={() => setRewardVisible(false)}
                />
            </Animated.View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    greeting: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold,
    },
    date: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.sm,
        marginTop: theme.spacing.xs,
    },
    headerButtons: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.card.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.card.border,
    },
    iconText: {
        fontSize: 20,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        overflow: 'hidden',
    },
    searchInputContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.card.border,
        overflow: 'hidden',
    },
    searchInput: {
        flex: 1,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    searchButton: {
        backgroundColor: theme.colors.primary.start,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeights.semibold,
    },
    scrollView: {
        flex: 1,
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxl,
        paddingHorizontal: theme.spacing.lg,
    },
    errorEmoji: {
        fontSize: 60,
        marginBottom: theme.spacing.md,
    },
    errorText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.lg,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: theme.spacing.lg,
        backgroundColor: theme.colors.primary.start,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    retryText: {
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeights.semibold,
    },
    additionalInfo: {
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
    },
    adminButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
        zIndex: 10,
    },
    adminButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    logoutButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
        zIndex: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    infoItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.card.border,
    },
    infoEmoji: {
        fontSize: 30,
        marginBottom: theme.spacing.sm,
    },
    infoLabel: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.fontSizes.sm,
    },
    infoValue: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.md,
        fontWeight: theme.typography.fontWeights.semibold,
        marginTop: theme.spacing.xs,
    },
    bottomSpacer: {
        height: 50,
    },
    logoutButtonFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 15,
        marginHorizontal: 20,
    },
    logoutTextFooter: {
        color: '#ff6b6b',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;
