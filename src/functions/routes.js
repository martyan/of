const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())

routes
    .add('shop')
    .add('blog')
    .add('cart')
    .add('product', '/product/:id')
    .add('admin')
    .add('user')
