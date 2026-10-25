import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function RewardModal({ visible, amount, totalCoins, onClose }) {
    const scale = useRef(new Animated.Value(0)).current;
    const { theme } = useTheme();

    useEffect(() => {
        if (visible) {
            scale.setValue(0);
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const animatedStyle = {
        transform: [{ scale: scale }],
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.container, animatedStyle]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="trophy" size={80} color="#FFD700" />
                    </View>

                    <Text style={styles.title}>CONGRATULATIONS!</Text>

                    <Text style={styles.message}>
                        You earned <Text style={styles.highlight}>{amount} Coins</Text>!
                    </Text>

                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Balance</Text>
                        <Text style={styles.statValue}>🪙 {totalCoins}</Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Awesome!</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#1A1A2E',
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    message: {
        fontSize: 18,
        color: '#E0E0E0',
        marginBottom: 25,
        textAlign: 'center',
    },
    highlight: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 22,
    },
    statBox: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginBottom: 25,
        alignItems: 'center',
        width: '100%',
    },
    statLabel: {
        color: '#CCC',
        fontSize: 14,
        marginBottom: 5,
    },
    statValue: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#1A1A2E',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
