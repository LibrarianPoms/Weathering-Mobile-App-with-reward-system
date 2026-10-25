import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import theme from '../styles/theme';

/**
 * Register Screen
 * Beautiful animated registration screen
 */
const RegisterScreen = ({ navigation }) => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const headerScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(headerScale, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!username) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        const result = await register(username, email, password);

        setLoading(false);

        if (!result.success) {
            setErrors({ general: result.message });
        }
    };

    return (
        <GradientBackground>
            <StatusBar style="light" />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <Animated.View
                        style={[
                            styles.headerContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: headerScale }],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={[theme.colors.secondary.start, theme.colors.secondary.end]}
                            style={styles.headerGradient}
                        >
                            <Text style={styles.headerEmoji}>✨</Text>
                        </LinearGradient>

                        <Text style={styles.headerTitle}>Create Account</Text>
                        <Text style={styles.headerSubtitle}>Join Weathering Waves</Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        {errors.general && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{errors.general}</Text>
                            </View>
                        )}

                        <AnimatedInput
                            label="Username"
                            value={username}
                            onChangeText={setUsername}
                            error={errors.username}
                            icon={<Text style={styles.inputIcon}>👤</Text>}
                        />

                        <AnimatedInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            error={errors.email}
                            icon={<Text style={styles.inputIcon}>📧</Text>}
                        />

                        <AnimatedInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                            icon={<Text style={styles.inputIcon}>🔒</Text>}
                        />

                        <AnimatedInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            error={errors.confirmPassword}
                            icon={<Text style={styles.inputIcon}>🔐</Text>}
                        />

                        <AnimatedButton
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            variant="secondary"
                            style={styles.registerButton}
                        />

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xxl,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: theme.spacing.lg,
    },
    backButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.md,
    },
    headerGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    headerEmoji: {
        fontSize: 40,
    },
    headerTitle: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.xxl,
        fontWeight: theme.typography.fontWeights.bold,
        marginTop: theme.spacing.md,
    },
    headerSubtitle: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.md,
        marginTop: theme.spacing.xs,
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.card.border,
    },
    errorContainer: {
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.typography.fontSizes.sm,
        textAlign: 'center',
    },
    inputIcon: {
        fontSize: 20,
    },
    registerButton: {
        marginTop: theme.spacing.md,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },
    loginText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.md,
    },
    loginLink: {
        color: theme.colors.secondary.start,
        fontSize: theme.typography.fontSizes.md,
        fontWeight: theme.typography.fontWeights.semibold,
    },
});

export default RegisterScreen;
