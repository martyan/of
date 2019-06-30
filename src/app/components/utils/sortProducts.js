const sortProducts = (products, order) => {
    let sortedProducts = []
    let unsortedProducts = [...products]

    order.forEach(productId => {
        const index = unsortedProducts.findIndex(product => product.id === productId)

        if(index > -1) {
            const product = unsortedProducts.splice(index, 1)[0]
            sortedProducts.push(product)
        }
    })

    return [...unsortedProducts, ...sortedProducts]
}

export default sortProducts
