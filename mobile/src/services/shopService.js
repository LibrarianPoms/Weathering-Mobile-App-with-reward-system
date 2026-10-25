import api from './api';

export const getShopItems = async () => {
    try {
        const response = await api.get('/shop/items');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const buyItem = async (itemId, type) => {
    try {
        const response = await api.post('/shop/buy', { itemId, type });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const equipItem = async (itemId, type) => {
    try {
        const response = await api.post('/shop/equip', { itemId, type });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getLeaderboard = async () => {
    try {
        const response = await api.get('/shop/leaderboard');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export default {
    getShopItems,
    buyItem,
    equipItem,
    getLeaderboard
};
