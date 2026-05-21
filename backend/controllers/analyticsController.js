const Order = require('../model/order');
const Product = require('../model/Product');
const User = require('../model/User')

const getAnalytics = async (req, res) => {
   try{
    const totalUsers = await User.countDocuments({role: 'user'});
    const totalOrders = await Order.countDocuments({});
    const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } 
    
    }
        
    ]);
    const topProducts = await Order.aggregate([
        { $unwind: "$products" },
        { $group: { _id: "$products.product", totalSold: { $sum: "$products.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
    ]);
    const topProductsDetails = await Product.find({ _id: { $in: topProducts.map(p => p._id) } }).select('name price');
    const topProductsWithDetails = topProducts.map(p => {
        const details = topProductsDetails.find(d => d._id.toString() === p._id.toString());
        return {
            productId: p._id,
            name: details ? details.name : 'Unknown',
            price: details ? details.price : 0,
            totalSold: p.totalSold
        };
    });

    res.json({
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
    });
   } catch (error) {
        res.status(500).json({ message: "Error retrieving analytics data" });
   }
   
};

module.exports = { getAnalytics };