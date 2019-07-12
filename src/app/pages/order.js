import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getOrder, getProducts } from '../lib/shop/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import OrderDetail from '../components/orders/Order'
import './order.scss'

class Order extends React.Component {

    static propTypes = {
        getOrder: PropTypes.func.isRequired,
        getProducts: PropTypes.func.isRequired,
        order: PropTypes.object.isRequired,
        products: PropTypes.arrayOf(PropTypes.object).isRequired
    }

    static getInitialProps = async ({ store, query }) => {
        await Promise.all([
            store.dispatch(getOrder(query.id)),
            store.dispatch(getProducts())
        ])

        return {}
    }

    render = () => {
        const { order, products } = this.props

        return (
            <PageWrapper>
                <div className="order-page">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <OrderDetail
                        order={order}
                        products={products}
                    />

                    <Footer />

                </div>
            </PageWrapper>
        )
    }
}

const mapStateToProps = (state) => ({
    order: state.shop.order,
    products: state.shop.products
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getOrder,
        getProducts
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Order)
