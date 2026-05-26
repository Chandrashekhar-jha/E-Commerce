const mongoose = require('c:/Users/Rajan/OneDrive/Desktop/Shopping/backend/node_modules/mongoose');
const dotenv = require('c:/Users/Rajan/OneDrive/Desktop/Shopping/backend/node_modules/dotenv');

dotenv.config({ path: 'c:/Users/Rajan/OneDrive/Desktop/Shopping/backend/.env' });

const ProductSchema = new mongoose.Schema({
    name: String,
    imageUrl: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const migrate = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // Update Coffee Maker
        const coffeeMakerResult = await Product.updateMany(
            { name: "Stainless Steel Coffee Maker" },
            { $set: { imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60" } }
        );
        console.log('Updated Coffee Maker:', coffeeMakerResult);

        // Update Leather Wallet
        const walletResult = await Product.updateMany(
            { name: "Leather Wallet" },
            { $set: { imageUrl: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=500&auto=format&fit=crop&q=60" } }
        );
        console.log('Updated Leather Wallet:', walletResult);

        // Update Portable Phone Charger
        const chargerResult = await Product.updateMany(
            { name: "Portable Phone Charger" },
            { $set: { imageUrl: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&auto=format&fit=crop&q=60" } }
        );
        console.log('Updated Portable Phone Charger:', chargerResult);

        console.log('Database image URL migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
