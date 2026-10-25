import api from './api';

// Get all users
export const getUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
