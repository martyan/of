import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProducts } from '../lib/shop/actions'
import { signOut } from '../lib/auth/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/common/Modal'
import SignIn from '../components/auth/SignIn'
import CreateAccount from '../components/auth/CreateAccount'
import AddProduct from '../components/products/AddProduct'
import DNDList from '../components/DNDList'
import './cart.scss'

class Admin extends React.Component {

    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        products: PropTypes.arrayOf(PropTypes.object).isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store }) => {
        await store.dispatch(getProducts())
        return {}
    }

    state = {
        signInVisible: false,
        createAccountVisible: false,
        addProductVisible: false,
        imgMGMTVisible: false,
        editProductVisible: false,
        productId: null
    }

    render = () => {
        const { products } = this.props
        const { signInVisible, createAccountVisible, addProductVisible, imgMGMTVisible, editProductVisible } = this.state

        return (
            <PageWrapper>
                <div className="admin">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <div>
                        <button onClick={() => this.setState({addProductVisible: true})}>Add product</button>

                        <div>
                            <DNDList
                                items={products}
                                onEdit={productId => this.setState({editProductVisible: true, productId})}
                                onManageImgs={productId => this.setState({imgMGMTVisible: true, productId})}
                            />
                        </div>
                    </div>

                    <Footer />

                    <Modal visible={editProductVisible} onClose={() => this.setState({editProductVisible: false})}>
                        <div>edit product</div>
                    </Modal>

                    <Modal visible={imgMGMTVisible} onClose={() => this.setState({imgMGMTVisible: false})}>
                        <div>imgMGMT product</div>
                    </Modal>

                    <Modal noPadding visible={addProductVisible} onClose={() => this.setState({addProductVisible: false})}>
                        <AddProduct close={() => this.setState({addProductVisible: false})} />
                    </Modal>

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

export default compose(withAuthentication(true), connect(mapStateToProps, mapDispatchToProps))(Admin)
