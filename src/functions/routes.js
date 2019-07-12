const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())

routes
    .add('shop')
    .add('blog')
    .add('cart')
    .add('order', '/order/:id')
    .add('product', '/product/:id')
    .add('products')
    .add('user')
