const nextRoutes = require('next-routes')
const routes = module.exports = nextRoutes()

routes
    .add('index', '/')
    .add('shop')
    .add('blog')
    .add('cart')
    .add('product', '/product/:id')
    .add('user')
    // .add('blog', '/blog/:slug')
    // .add('user', '/user/:id', 'profile')
    // .add('/:noname/:lang(en|es)/:wow+', 'complex')
    // .add({name: 'beta', pattern: '/v3', page: 'v3'})
