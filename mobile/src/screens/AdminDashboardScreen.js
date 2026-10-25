import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getUsers, deleteUser } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import GradientBackground from '../components/GradientBackground';

export default function AdminDashboardScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = (user) => {
        if (user.is_admin === 1) {
            Alert.alert('Cannot Delete', 'You cannot delete an admin user.');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete ${user.username}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteUser(user.id);
                            fetchUsers(); // Refresh list
                            Alert.alert('Success', 'User deleted successfully');
                        } catch (error) {
                            Alert.alert('Error', error.message || 'Failed to delete user');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
                {item.is_admin === 1 && <Text style={styles.adminBadge}>Admin</Text>}
            </View>
            {item.is_admin !== 1 && (
                <TouchableOpacity
                    onPress={() => handleDeleteUser(item)}
                    style={styles.deleteButton}
                >
                    <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <GradientBackground>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Management</Text>
                <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading && users.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No users found</Text>
                    }
                />
            )}
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    backButton: {
        padding: 5,
    },
    refreshButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContent: {
        padding: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 2,
    },
    adminBadge: {
        color: '#4ecdc4',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    deleteButton: {
        padding: 10,
    },
    emptyText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});
