const db = require('./config/database');
const User = require('./models/User');

const runVerify = async () => {
    try {
        await db.initDatabase();

        console.log('Verifying User.getAll()...');
        const users = User.getAll(); // sync call in User.js? User.getAll calls db.all which is sync wrapper
        console.log('Success! Users found:', users.length);
        console.log('First user:', users[0]);

        // Check columns
        const tableInfo = db.all("PRAGMA table_info(users)");
        console.log('Users Table:', tableInfo.map(c => c.name));

        const itemsInfo = db.all("PRAGMA table_info(user_items)");
        console.log('User Items Table:', itemsInfo.length > 0 ? itemsInfo.map(c => c.name) : 'MISSING!');


    } catch (error) {
        console.error('FAILED:', error);
    }
};

runVerify();
