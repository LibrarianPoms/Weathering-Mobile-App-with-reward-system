import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Manages authentication state across the app
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const storedUser = await authService.getStoredUser();

            if (token && storedUser) {
                setUser(storedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        const result = await authService.login(email, password);

        if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
        }

        return result;
    };

    const register = async (username, email, password) => {
        const result = await authService.register(username, email, password);

        if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
        }

        return result;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updates) => {
        if (user) {
            setUser(prev => ({ ...prev, ...updates }));
            // Optional: Update storage if we rely on it for persistence of these fields
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use Auth Context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
