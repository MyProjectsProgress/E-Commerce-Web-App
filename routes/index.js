const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const brandRoute = require('./brandRoute');
const productRoute = require('./productRoute');
const reviewRoute = require('./reviewRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const wishlistRoute = require('./wishlistRoute');
const addressRoute = require('./addressRoute');
const copounRoute = require('./couponRoute');
const cartRoute = require('./cartRoute');

const mountRoutes = (app) => {
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/subcategories', subCategoryRoute);
    app.use('/api/v1/brands', brandRoute);
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/reviews', reviewRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/wishlist', wishlistRoute);
    app.use('/api/v1/address', addressRoute);
    app.use('/api/v1/coupon', copounRoute);
    app.use('/api/v1/cart', cartRoute);
};

module.exports = mountRoutes;