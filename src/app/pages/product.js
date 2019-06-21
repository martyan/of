import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProducts } from '../lib/shop/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { products } from '../fakeData'
import ProductDetail from '../components/products/Product'
import './product.scss'

class Product extends React.Component {

    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store, query }) => {
        await store.dispatch(getProducts())

        console.log(query)

        return {}
    }

    render = () => {
        const product = products[Math.floor(Math.random() * products.length)]

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
    user: state.auth.user
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getProducts
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Product)
