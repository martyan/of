import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProducts } from '../lib/shop/actions'
import { signOut } from '../lib/auth/actions'
import withAuthentication from '../lib/withAuthentication'
import { Router } from '../../functions/routes'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/common/Modal'
import SignIn from '../components/auth/SignIn'
import CreateAccount from '../components/auth/CreateAccount'
import './cart.scss'
import Button from '../components/common/Button'

class Cart extends React.Component {

    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        products: PropTypes.arrayOf(PropTypes.object).isRequired,
        signOut: PropTypes.func.isRequired,
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

    render = () => {
        const { user, signOut } = this.props
        const { signInVisible, createAccountVisible } = this.state

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

                    <Footer />

                    <Modal noPadding visible={signInVisible} onClose={() => this.setState({signInVisible: false})}>
                        <SignIn close={() => this.setState({signInVisible: false})} />
                    </Modal>

                    <Modal noPadding visible={createAccountVisible} onClose={() => this.setState({createAccountVisible: false})}>
                        <CreateAccount close={() => this.setState({createAccountVisible: false})} />
                    </Modal>
                </div>
            </PageWrapper>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    products: state.shop.products
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getProducts,
        signOut
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Cart)
