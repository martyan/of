import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProducts, deleteProduct, getConfig } from '../lib/shop/actions'
import { signOut } from '../lib/auth/actions'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import styled from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../components/common/Modal'
import SignIn from '../components/auth/SignIn'
import CreateAccount from '../components/auth/CreateAccount'
import ProductAdmin from '../components/admin/ProductAdmin'
import Button from '../components/common/Button'
import EditProduct from '../components/admin/EditProduct'
import Stock from '../components/admin/Stock'
import ImgMGMT from '../components/admin/ImgMGMT'
import './admin.scss'

class Admin extends React.Component {

    static propTypes = {
        getProducts: PropTypes.func.isRequired,
        getConfig: PropTypes.func.isRequired,
        products: PropTypes.arrayOf(PropTypes.object).isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store }) => {
        await store.dispatch(getProducts())
        await store.dispatch(getConfig('order'))
        return {}
    }

    state = {
        signInVisible: false,
        createAccountVisible: false,
        addProductVisible: false,
        imgMGMTVisible: false,
        editProductVisible: false,
        deleteProductVisible: false,
        stockVisible: false,
        productId: null
    }

    deleteProduct = () => {
        const { deleteProduct, getProducts } = this.props
        const { productId } = this.state

        deleteProduct(productId)
            .then(getProducts)
            .then(() => this.setState({deleteProductVisible: false}))
            .catch(console.error)
    }

    render = () => {
        const { products } = this.props
        const {
            signInVisible,
            createAccountVisible,
            addProductVisible,
            imgMGMTVisible,
            editProductVisible,
            deleteProductVisible,
            stockVisible,
            productId
        } = this.state

        const selectedProduct = products.find(product => product.id === productId)

        return (
            <PageWrapper>
                <div className="admin">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <div className="inner">
                        <Button onClick={() => this.setState({addProductVisible: true})}>Add product</Button>

                        <ProductAdmin
                            products={products}
                            onEdit={productId => this.setState({editProductVisible: true, productId})}
                            onManageImgs={productId => this.setState({imgMGMTVisible: true, productId})}
                            onDelete={productId => this.setState({deleteProductVisible: true, productId})}
                            onStock={productId => this.setState({stockVisible: true, productId})}
                        />
                    </div>

                    <Footer />

                    <Modal visible={addProductVisible} onClose={() => this.setState({addProductVisible: false})}>
                        <EditProduct
                            close={() => this.setState({addProductVisible: false})}
                        />
                    </Modal>

                    <Modal visible={editProductVisible} onClose={() => this.setState({editProductVisible: false})}>
                        <EditProduct
                            product={selectedProduct}
                            close={() => this.setState({editProductVisible: false})}
                        />
                    </Modal>

                    <Modal visible={stockVisible} onClose={() => this.setState({stockVisible: false})}>
                        <Stock
                            product={selectedProduct}
                            close={() => this.setState({stockVisible: false})}
                        />
                    </Modal>

                    <Modal visible={deleteProductVisible} onClose={() => this.setState({deleteProductVisible: false})}>
                        <Confirmation>
                            <h1>Do you really want to delete the product?</h1>
                            <div>
                                <button onClick={this.deleteProduct}>Delete</button>
                                <button onClick={() => this.setState({deleteProductVisible: false})}>Keep</button>
                            </div>
                        </Confirmation>
                    </Modal>

                    <Modal stretch visible={imgMGMTVisible} onClose={() => this.setState({imgMGMTVisible: false})}>
                        <ImgMGMT
                            product={selectedProduct}
                            close={() => this.setState({imgMGMTVisible: false})}
                        />
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
        getConfig,
        deleteProduct,
        signOut
    }, dispatch)
)

export default compose(withAuthentication(true), connect(mapStateToProps, mapDispatchToProps))(Admin)

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
