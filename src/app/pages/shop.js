import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getTodos } from '../lib/todo/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductList from '../components/products/ProductList'
import './shop.scss'

class Shop extends React.Component {

    static propTypes = {
        getTodos: PropTypes.func.isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store }) => {
        await store.dispatch(getTodos())
        return {}
    }

    render = () => {
        return (
            <PageWrapper>
                <div className="shop">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <ProductList />

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
        getTodos
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Shop)
