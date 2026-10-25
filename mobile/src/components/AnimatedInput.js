import React, { useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import theme from '../styles/theme';

/**
 * Animated Input Component
 * Beautiful input with floating label animation
 */
const AnimatedInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    error,
    icon,
}) => {
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    useEffect(() => {
        if (error) {
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [error]);

    const labelStyle = {
        position: 'absolute',
        left: icon ? 50 : 16,
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -10],
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.colors.text.muted, theme.colors.primary.start],
        }),
        backgroundColor: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', theme.colors.background.start],
        }),
        paddingHorizontal: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 8],
        }),
    };

    return (
        <Animated.View
            style={[
                styles.container,
                error && styles.containerError,
                { transform: [{ translateX: shakeAnimation }] },
            ]}
        >
            {icon && <View style={styles.iconContainer}>{icon}</View>}

            <Animated.Text style={labelStyle}>{label}</Animated.Text>

            <TextInput
                style={[styles.input, icon && styles.inputWithIcon]}
                value={value}
                onChangeText={onChangeText}
                placeholder=""
                placeholderTextColor={theme.colors.text.muted}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType || 'default'}
                autoCapitalize={autoCapitalize || 'none'}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.card.border,
        marginBottom: theme.spacing.md,
        position: 'relative',
    },
    containerError: {
        borderColor: theme.colors.error,
    },
    iconContainer: {
        position: 'absolute',
        left: 16,
        top: 18,
        zIndex: 1,
    },
    input: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        height: 56,
    },
    inputWithIcon: {
        paddingLeft: 50,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.typography.fontSizes.xs,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
});

export default AnimatedInput;
