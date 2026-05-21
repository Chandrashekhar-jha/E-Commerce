const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const createPaymentOrder = async (req, res) => {

    try {

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {

        console.error('Error creating payment order:', error);

        res.status(500).json({
            success: false,
            message: 'Error creating payment order'
        });

    }

};


const verifyPayment = (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generated_signature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id +
                '|' +
                razorpay_payment_id
            )
            .digest('hex');

        if (
            generated_signature ===
            razorpay_signature
        ) {

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id
            });

        } else {

            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });

        }

    } catch (error) {

        console.error('Error verifying payment:', error);

        res.status(500).json({
            success: false,
            message: 'Error verifying payment'
        });

    }

};


module.exports = {
    createPaymentOrder,
    verifyPayment
};