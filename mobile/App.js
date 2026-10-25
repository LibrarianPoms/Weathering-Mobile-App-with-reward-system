import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import ApiService from './src/services/api';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ShopScreen from './src/screens/ShopScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import LoadingSpinner from './src/components/LoadingSpinner';
import GradientBackground from './src/components/GradientBackground';

const Stack = createNativeStackNavigator();

/**
 * Auth Stack - Screens for unauthenticated users
 */
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
        }}
    >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

/**
 * App Stack - Screens for authenticated users
 */
const AppStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}
    >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
);

/**
 * Navigation Container - Switches between Auth and App stacks
 */
const Navigation = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <GradientBackground>
                <LoadingSpinner message="Starting Weathering Waves..." />
            </GradientBackground>
        );
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

/**
 * Main App Component
 */
export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Navigation />
            </ThemeProvider>
        </AuthProvider>
    );
}
