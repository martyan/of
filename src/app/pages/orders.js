import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getOrders, deleteOrder } from '../lib/shop/actions'
import { signOut } from '../lib/auth/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import styled from 'styled-components'
import moment from 'moment'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/common/Modal'


class OrdersPage extends React.Component {

    static propTypes = {
        getOrders: PropTypes.func.isRequired,
        orders: PropTypes.arrayOf(PropTypes.object).isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store }) => {
        await Promise.all([
            store.dispatch(getOrders()),
        ])

        return {}
    }

    state = {
        deleteOrderVisible: false,
        orderId: null
    }

    deleteOrder = () => {
        const { deleteOrder, getOrders } = this.props
        const { orderId } = this.state

        deleteOrder(orderId)
            .then(getOrders)
            .then(() => this.setState({deleteOrderVisible: false}))
            .catch(console.error)
    }

    render = () => {
        const { orders } = this.props
        const { deleteOrderVisible } = this.state

        console.log(orders)

        return (
            <PageWrapper>
                <Container>

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <div>
                        {orders.map(order => (
                            <Order key={order.id}>{console.log(order)}
                                <div className="created">{moment(order.createdAt.seconds * 1000).format('ddd DD/MM/YYYY hh:mm')}</div>
                                <div className="price">{order.currency} {order.totalPrice}</div>
                                <div className="amount">{order.products.length} {order.products.length === 1 ? 'pc' : 'pcs'}</div>
                                <div className="actions">
                                    <button><i className="fa fa-eye"></i></button>
                                </div>
                            </Order>
                        ))}
                    </div>

                    <Footer />

                    <Modal visible={deleteOrderVisible} onClose={() => this.setState({deleteOrderVisible: false})}>
                        <Confirmation>
                            <h1>Do you really want to delete the order?</h1>
                            <div>
                                <button onClick={this.deleteOrder}>Delete</button>
                                <button onClick={() => this.setState({deleteOrderVisible: false})}>Keep</button>
                            </div>
                        </Confirmation>
                    </Modal>
                </Container>
            </PageWrapper>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    orders: state.shop.orders
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getOrders,
        deleteOrder,
        signOut
    }, dispatch)
)

export default compose(withAuthentication(true), connect(mapStateToProps, mapDispatchToProps))(OrdersPage)


const Container = styled.div`
    min-height: 100vh;
    padding-bottom: 100px;
    position: relative;

    .inner {
        max-width: 640px;
        margin: 0 auto;
        padding: 15px;
    }
`

const Confirmation = styled.div`
    h1 {
        margin: 40px 0;
        font-weight: 500;
        font-size: 1.1em;
        text-align: center;
        color: #222;
    }
    
    div {
        display: flex;
    }
    
    button {
        flex: 1;
        padding: 5px;
        cursor: pointer;
        transition: .2s ease;
        
        &:first-child {
            border: 1px solid indianred;
            background: white;
            color: indianred;
            margin-right: 5px;
            
            &:hover {
                border: 1px solid indianred;
                background: indianred;
                color: white;
            }
        }
        
        &:last-child {
            border: 1px solid #222;
            background: white;
            color: #222;
            margin-left: 5px;
            
            &:hover {
                border: 1px solid white;
                background: #222;
                color: white;
            }
        }
    }
`

const Order = styled.div`
    display: flex;
    padding: 5px 10px;
    align-items: center;

    .created {
        padding: 3px;
        color: #999;
        font-size: .85em;
    }

    .price {
        padding: 3px;
        font-weight: 600;
    }

    .amount {
        padding: 3px 5px;
    }

    .actions {
        button {
            background: transparent;
            border: none;
        }
    }
`
