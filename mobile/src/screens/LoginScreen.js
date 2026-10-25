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
    Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import theme from '../styles/theme';

const { width, height } = Dimensions.get('window');

/**
 * Login Screen
 * Beautiful animated login screen with purple gradients
 */
const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.5)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous logo animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotate, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        const result = await login(email, password);

        setLoading(false);

        if (!result.success) {
            setErrors({ general: result.message });
        }
    };

    const rotate = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-5deg', '5deg'],
    });

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
                    {/* Logo Section */}
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { scale: logoScale },
                                    { rotate },
                                ],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary.start, theme.colors.primary.end]}
                            style={styles.logoGradient}
                        >
                            <Text style={styles.logoEmoji}>🌤️</Text>
                        </LinearGradient>
                        <Text style={styles.appName}>Weathering Waves</Text>
                        <Text style={styles.tagline}>Your Weather Companion</Text>
                    </Animated.View>

                    {/* Form Section */}
                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                        <Text style={styles.subtitleText}>Sign in to continue</Text>

                        {errors.general && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{errors.general}</Text>
                            </View>
                        )}

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

                        <AnimatedButton
                            title="Sign In"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.loginButton}
                        />

                        {/* Register Link */}
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Sign Up</Text>
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
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xxl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    logoGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.glow,
    },
    logoEmoji: {
        fontSize: 60,
    },
    appName: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.xxl,
        fontWeight: theme.typography.fontWeights.bold,
        marginTop: theme.spacing.md,
    },
    tagline: {
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
    welcomeText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.bold,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    subtitleText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.md,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
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
    loginButton: {
        marginTop: theme.spacing.md,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },
    registerText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSizes.md,
    },
    registerLink: {
        color: theme.colors.primary.start,
        fontSize: theme.typography.fontSizes.md,
        fontWeight: theme.typography.fontWeights.semibold,
    },
});

export default LoginScreen;
