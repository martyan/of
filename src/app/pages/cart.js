import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProducts, createPayment, removeFromCart, createOrder } from '../lib/shop/actions'
import { signOut } from '../lib/auth/actions'
import withAuthentication from '../lib/withAuthentication'
import { Elements } from 'react-stripe-elements'
import { Router } from '../../functions/routes'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/common/Modal'
import SignIn from '../components/auth/SignIn'
import CreateAccount from '../components/auth/CreateAccount'
import Button from '../components/common/Button'
import CheckoutForm from '../components/cart/CheckoutForm'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/scss/main.scss'
import './cart.scss'

class Cart extends React.Component {

    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        products: PropTypes.arrayOf(PropTypes.object).isRequired,
        createOrder: PropTypes.func.isRequired,
        removeFromCart: PropTypes.func.isRequired,
        signOut: PropTypes.func.isRequired,
        createPayment: PropTypes.func.isRequired,
        cart: PropTypes.arrayOf(PropTypes.object).isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store }) => {
        await store.dispatch(getProducts())
        return {}
    }

    state = {
        signInVisible: false,
        createAccountVisible: false
    }

    createOrder = () => {
        const { createOrder, cart } = this.props

        const data = {
            currency: 'CZK',
            products: cart
        }

        createOrder(data)
            .catch(errors => {
                errors.map(error => {
                    toast.error(error, {
                        position: 'top-right',
                        autoClose: false,
                        closeOnClick: true,
                        draggable: true,
                        closeButton: false
                    })
                })
            })
    }

    render = () => {
        const { user, signOut, createPayment, cart, products, removeFromCart } = this.props
        const { signInVisible, createAccountVisible } = this.state

        const uniqueProductsInCart = cart.filter((item, index) => {
            const upperCartPart = cart.slice(index + 1, cart.length)
            const anotherItemInCart = upperCartPart.find(anotherItem => (anotherItem.id === item.id && anotherItem.size === item.size))

            return !anotherItemInCart
        })

        return (
            <PageWrapper>
                <div className="cart">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <div className="inner">

                        {uniqueProductsInCart.map(item => {
                            const product = products.find(product => product.id === item.id)
                            const count = cart.filter(cartItem => cartItem.id === item.id && cartItem.size === item.size).length

                            return (
                                <div key={item.id + item.size}>
                                    <div>{product.name} [{item.size}]</div>
                                    <div>{count}x</div>
                                    <button onClick={() => removeFromCart(item)}>Remove</button>
                                </div>
                            )
                        })}

                        <Button onClick={this.createOrder}>Create order</Button>

                        {!user ? (
                            <>
                                <Button onClick={() => this.setState({createAccountVisible: true})}>Create account</Button>
                                <Button onClick={() => this.setState({signInVisible: true})}>Log in</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => Router.pushRoute('/admin')}>Manage products</Button>
                                <Button onClick={() => signOut().catch(console.error)}>Sign out</Button>
                            </>
                        )}
                    </div>

                    <Elements>
                        <CheckoutForm createPayment={createPayment} />
                    </Elements>

                    <Footer />

                    <Modal noPadding visible={signInVisible} onClose={() => this.setState({signInVisible: false})}>
                        <SignIn close={() => this.setState({signInVisible: false})} />
                    </Modal>

                    <Modal noPadding visible={createAccountVisible} onClose={() => this.setState({createAccountVisible: false})}>
                        <CreateAccount close={() => this.setState({createAccountVisible: false})} />
                    </Modal>

                    <ToastContainer />
                </div>
            </PageWrapper>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    products: state.shop.products,
    cart: state.shop.cart
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getProducts,
        signOut,
        createPayment,
        removeFromCart,
        createOrder
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Cart)
