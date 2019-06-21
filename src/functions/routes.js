const routes = module.exports = require('next-routes')()

routes
    .add('index')
    .add('shop')
    .add('blog')
    .add('cart')
    .add('product', '/product/:id')
    .add('user')
    // .add('blog', '/blog/:slug')
    // .add('user', '/user/:id', 'profile')
    // .add('/:noname/:lang(en|es)/:wow+', 'complex')
    // .add({name: 'beta', pattern: '/v3', page: 'v3'})
