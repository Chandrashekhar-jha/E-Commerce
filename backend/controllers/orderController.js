const Order = require('../model/order');

const sendEmail = require('../utils/sendMail'); 

const createOrder = async (req, res) => {

    const { products, totalPrice, address, paymentId } = req.body;
    try {

        if (!products || !totalPrice || !address || !paymentId) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields' 
            });
        }

        const order = await Order.create({
            user: req.user._id,
            products,
            totalPrice,
            address,
            paymentId,
            status: 'pending'
        });

        if (order) {

            // Email message
            const message = `Your order with ID ${order._id} has been placed successfully. Total Price: ₹${totalPrice}`;
            await sendEmail(req.user.email, 'Order Placed', message);
            
            return res.status(201).json({ 
                success: true,
                message: 'Order created successfully',
                orderId: order._id,
                order
            });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating order' 
        });
    }
};

const myOrders = async (req, res) => {

    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price imageUrl')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching orders' 
        });
    }
};

const getOrders = async (req, res) => {

    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching orders' 
        });
    }
};

const getMyOrdersById = async (req, res) => {
    
    try {
        const { orderId } = req.params;
        
        if (orderId) {
            // Get specific order by ID for current user
            const order = await Order.findOne({ 
                _id: orderId,
                user: req.user._id 
            })
            .populate('products.product', 'name price imageUrl')
            .populate('user', 'name email');
            
            if (!order) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Order not found' 
                });
            }
            
            return res.status(200).json({
                success: true,
                order
            });
        } else {
            // Get all orders for current user
            const orders = await Order.find({ user: req.user._id })
                .populate('products.product', 'name price imageUrl')
                .sort({ createdAt: -1 });
            
            res.status(200).json({
                success: true,
                orders
            });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching orders' 
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
        if (!status) {
            return res.status(400).json({ 
                success: false,
                message: 'Status is required' 
            });
        }

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` 
            });
        }

        const order = await Order.findByIdAndUpdate(
            id, 
            { status },
            { new: true, runValidators: true }
        )
        .populate('user', 'name email')
        .populate('products.product', 'name price');    
        
        if (order) {
            // Email message
            const message = `Your order with ID ${order._id} status has been updated to: ${status}`;
            await sendEmail(order.user.email, 'Order Status Updated', message);
            
            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                order
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating order status' 
        });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        await Order.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting order'
        });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    getMyOrdersById,
    updateOrderStatus,
    deleteOrder
};