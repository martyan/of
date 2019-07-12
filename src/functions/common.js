const getData = (res) => {
    if(!res) return null

    if(res.forEach) {
        let data = []
        res.forEach(item => {
            data.push({...item.data(), id: item.id})
        })
        return data
    }

    if(res.data) {
        return {...res.data(), id: res.id}
    }

    return res
}

const generatePaymentResponse = (intent) => {
    if(intent.status === 'requires_action' && intent.next_action.type === 'use_stripe_sdk') {
        // Tell the client to handle the action
        return {
            requires_action: true,
            payment_intent_client_secret: intent.client_secret
        }
    } else if(intent.status === 'succeeded') {
        // The payment didn’t need any additional actions and completed!
        // Handle post-payment fulfillment
        return { success: true }
    } else {
        return { error: 'Invalid PaymentIntent status' }
    }
}

const createPaymentHandler = (stripe) => async (req, res) => {
    try {
        let intent
        if(req.body.payment_method_id) {
            intent = await stripe.paymentIntents.create({
                payment_method: req.body.payment_method_id,
                amount: 1099,
                currency: 'gbp',
                confirmation_method: 'manual',
                confirm: true
            })
        } else if(req.body.payment_intent_id) {
            intent = await stripe.paymentIntents.confirm(req.body.payment_intent_id)
        }

        res.send(generatePaymentResponse(intent))
    } catch(e) {
        // Display error on client
        return res.send({ error: e.message })
    }
}

const createOrderHandler = (admin) => async (req, res) => {
    const { currency, products } = req.body

    const uniqueProducts = [...new Set(products.map(product => product.id))]
    const getPromises = uniqueProducts.map(productId => admin.firestore().collection('products').doc(productId).get())
    const results = await Promise.all(getPromises)

    const order = {
        currency,
        products: [],
        totalPrice: 0,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    }

    let errors = []
    let updatedProducts = []

    results.forEach(async (result) => {
        const orderedProduct = getData(result)

        const productSizes = products
            .filter(product => product.id === orderedProduct.id)
            .map(product => product.size)

        const uniqueSizes = [...new Set(productSizes)]

        updatedProducts = uniqueSizes.forEach(size => {
            const orderedQuantity = products.filter(product => product.size === size).length

            if(!orderedProduct.quantity.hasOwnProperty(size)) return errors.push(`Product '${orderedProduct.name}' isn't stocked in size '${size}'`)
            else if(orderedQuantity > orderedProduct.quantity[size]) return errors.push(`Product '${orderedProduct.name}' isn't stocked in size '${size}' in required amount`)

            if(errors.length) return

            const updatedProduct = {
                quantity: {
                    ...orderedProduct.quantity,
                    [size]: orderedProduct.quantity[size] - orderedQuantity
                }
            }

            order.products.push({id: orderedProduct.id, size, amount: orderedQuantity, price: orderedProduct.price})
            order.totalPrice += (orderedProduct.price * orderedQuantity)

            updatedProducts.push({ id: orderedProduct.id, data: updatedProduct })
        })
    })

    if(errors.length > 0) return res.status(400).send(errors)

    await Promise.all(updatedProducts.map(product => admin.firestore().collection('products').doc(product.id).update(product.data)))

    admin.firestore().collection('orders').add(order)
        .then(docRef => res.send({ success: true, order: docRef.id }))
        .catch(error => {
            res.status(400)
            return res.render('error', { error: 'Failed to write to database.' })
        })
}


module.exports = {
    createPaymentHandler,
    createOrderHandler
}
