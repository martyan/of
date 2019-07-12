import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createPayment, createInvoicing } from '../../lib/shop/actions'
import styled from 'styled-components'
import { media } from '../common/variables'
import { Router } from '../../../functions/routes'
import { Elements } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm'

const Order = ({ order, products, createInvoicing, createPayment }) => {
    // const [size, setSize] = useState('')
    //
    // const back = () => {
    //     Router.pushRoute('/shop')
    // }
    //
    // const handleAddToCart = () => {
    //     if(size === '') return
    //     addToCart({id: order.id, size})
    // }

    console.log(order)

    return (
        <div>
            <Wrapper>
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <td>Product</td>
                                <td>Amount</td>
                                <td>Price per pc</td>
                                <td>Price</td>
                            </tr>
                        </thead>
                        <tbody>
                            {order.products.map(orderProduct => {
                                const product = products.find(product => product.id === orderProduct.id)

                                return (
                                    <tr key={product.id + orderProduct.size}>
                                        <td>{product.name} ({orderProduct.size})</td>
                                        <td>{orderProduct.amount}</td>
                                        <td>{order.currency} {orderProduct.price}</td>
                                        <td>{order.currency} {orderProduct.price * orderProduct.amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>

                    <TotalPrice>
                        <div className="label">Total</div>
                        <div className="value">{order.currency} {order.totalPrice}</div>
                    </TotalPrice>
                </div>

                {order.hasOwnProperty('invoicing') && (
                    <Elements>
                        <CheckoutForm createPayment={createPayment} />
                    </Elements>
                )}
            </Wrapper>

            <style jsx global>{`
            `}</style>
        </div>
    )
}

Order.propTypes = {
    order: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createPayment
    }, dispatch)
)

export default connect(null, mapDispatchToProps)(Order)


const Wrapper = styled.div`
    padding: 15px;
    max-width: 1280px;
    margin: 30px auto 0;
    
    ${media.tablet} {
        display: flex;
    }
`

const Table = styled.table`
    border-collapse: collapse;
    
    tr, td {
        padding: 0;
    }
`

const TotalPrice = styled.div`
    display: flex;
    justify-content: space-between;
    
    .label {}
    .value {}
`
