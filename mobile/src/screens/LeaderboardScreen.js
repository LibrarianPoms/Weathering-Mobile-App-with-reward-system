import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import LoadingSpinner from '../components/LoadingSpinner';
import shopService from '../services/shopService';

export default function LeaderboardScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const data = await shopService.getLeaderboard(); // Assume response structure
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }) => {
        let medal = null;
        if (index === 0) medal = '🥇';
        if (index === 1) medal = '🥈';
        if (index === 2) medal = '🥉';

        return (
            <View style={styles.card}>
                <View style={styles.rankContainer}>
                    {medal ? (
                        <Text style={styles.medal}>{medal}</Text>
                    ) : (
                        <Text style={styles.rank}>#{index + 1}</Text>
                    )}
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.username}</Text>
                </View>
                <View style={styles.coinContainer}>
                    <Text style={styles.coins}>{item.coins} 🪙</Text>
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
                <Text style={styles.headerTitle}>Leaderboard</Text>
            </View>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No rankings yet!</Text>
                    }
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
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rank: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    medal: {
        fontSize: 24,
    },
    userInfo: {
        flex: 1,
        marginLeft: 10,
    },
    username: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    coinContainer: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    coins: {
        color: '#ffd700',
        fontWeight: 'bold',
    },
    empty: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});
