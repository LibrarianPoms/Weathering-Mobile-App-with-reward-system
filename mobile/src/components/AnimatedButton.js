import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * Animated Button Component
 * Beautiful gradient button with press animation
 */
const AnimatedButton = ({
    title,
    onPress,
    disabled,
    loading,
    variant = 'primary',
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const gradientColors = variant === 'primary'
        ? [theme.colors.primary.start, theme.colors.primary.end]
        : [theme.colors.secondary.start, theme.colors.secondary.end];

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: disabled ? 0.5 : opacityAnim,
                },
            ]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={1}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <Text style={styles.text}>Loading...</Text>
                    ) : (
                        <Text style={styles.text}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    gradient: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    text: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.lg,
        fontWeight: theme.typography.fontWeights.semibold,
    },
});

export default AnimatedButton;
