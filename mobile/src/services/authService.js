import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Register a new user
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User data and token
 */
export const register = async (username, email, password) => {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
        });

        if (response.data.success) {
            const { user, token } = response.data.data;

            // Store token and user info
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            return { success: true, user, token };
        }

        return { success: false, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';
        return { success: false, message };
    }
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password,
        });

        if (response.data.success) {
            const { user, token } = response.data.data;

            // Store token and user info
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            return { success: true, user, token };
        }

        return { success: false, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        return { success: false, message };
    }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
};

/**
 * Get stored user info
 * @returns {Promise<Object|null>}
 */
export const getStoredUser = async () => {
    try {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
};

/**
 * Get user profile from API
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
    try {
        const response = await api.get('/auth/me');
        return { success: true, user: response.data.data.user };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to get profile';
        return { success: false, message };
    }
};

export default {
    register,
    login,
    logout,
    getStoredUser,
    isAuthenticated,
    getProfile,
};
