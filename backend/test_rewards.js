const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('Registering user...');
        const unique = Date.now();
        const email = `test${unique}@example.com`;
        const resReg = await axios.post(`${API_URL}/auth/register`, {
            username: `testuser${unique}`,
            email,
            password: 'password123'
        });
        console.log('Registered. Token:', resReg.data.data?.token ? 'Yes' : 'No');

        const token = resReg.data.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('Search 1...');
        const res1 = await axios.get(`${API_URL}/weather/current?city=London`, config);
        console.log('Reward 1:', res1.data.meta?.reward);

        console.log('Search 2...');
        const res2 = await axios.get(`${API_URL}/weather/current?city=Paris`, config);
        console.log('Reward 2:', res2.data.meta?.reward);

        console.log('Search 3...');
        const res3 = await axios.get(`${API_URL}/weather/current?city=Tokyo`, config);
        console.log('Reward 3:', res3.data.meta?.reward);

        console.log('Checking Shop...');
        const resShop = await axios.get(`${API_URL}/shop/items`, config);
        console.log('Shop Items Loaded:', resShop.data.success);

        console.log('Checking Leaderboard...');
        const resLead = await axios.get(`${API_URL}/shop/leaderboard`, config);
        console.log('Leaderboard:', JSON.stringify(resLead.data.data));

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
};

runTest();
