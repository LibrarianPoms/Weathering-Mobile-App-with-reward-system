import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * Loading Spinner Component
 * Animated loading state with pulsing effect
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Rotate animation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.spinnerContainer,
                    {
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.rotatingBorder,
                        { transform: [{ rotate }] },
                    ]}
                >
                    <LinearGradient
                        colors={[theme.colors.primary.start, theme.colors.primary.end]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBorder}
                    />
                </Animated.View>
                <View style={styles.innerCircle}>
                    <Text style={styles.weatherIcon}>🌤️</Text>
                </View>
            </Animated.View>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinnerContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rotatingBorder: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    gradientBorder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    innerCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: theme.colors.background.start,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherIcon: {
        fontSize: 40,
    },
    message: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.md,
        marginTop: theme.spacing.lg,
    },
});

export default LoadingSpinner;
