import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProduct } from '../lib/shop/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductDetail from '../components/products/Product'
import './product.scss'

class Product extends React.Component {

    static propTypes = {
        getProduct: PropTypes.func.isRequired
    }

    static getInitialProps = async ({ store, query }) => {
        await store.dispatch(getProduct(query.id))

        return {}
    }

    render = () => {
        const { product } = this.props

        return (
            <PageWrapper>
                <div className="product-page">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <ProductDetail product={product} />

                    <Footer />

                </div>
            </PageWrapper>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    product: state.shop.product
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getProduct
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Product)
