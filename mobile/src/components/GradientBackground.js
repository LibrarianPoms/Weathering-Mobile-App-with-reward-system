import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

/**
 * Gradient Background Component
 * Beautiful purple gradient background for all screens
 */
const GradientBackground = ({ children, style, colors }) => {
    const { activeTheme } = useTheme();

    const gradientColors = colors || [
        activeTheme.start,
        activeTheme.middle || activeTheme.end, // Handle 2-color vs 3-color gradients
        activeTheme.end,
    ];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});

export default GradientBackground;
