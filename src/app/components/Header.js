import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Router } from '../../functions/routes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signOut } from '../lib/auth/actions'
import { setDefaultFilters } from '../lib/shop/actions'
import styled from 'styled-components'
import Modal from './common/Modal'
import CreateAccount from './auth/CreateAccount'
import SignIn from './auth/SignIn'
import cartIcon from '../static/img/cart.svg'
import { media } from './common/variables'

class Header extends React.Component {

    static propTypes = {
        setDefaultFilters: PropTypes.func.isRequired,
        cart: PropTypes.arrayOf(PropTypes.object).isRequired,
        user: PropTypes.object,
        noSignIn: PropTypes.bool
    }

    state = {
        createAccountVisible: false,
        signInVisible: false
    }

    signOut = () => {
        const { signOut } = this.props

        signOut()
            .catch(console.error)
    }

    render = () => {
        const { user, noSignIn, setDefaultFilters, cart } = this.props
        const { createAccountVisible, signInVisible } = this.state

        return (
            <>
                <Wrapper>
                    <Inner>
                        <Logo>
                            <Link href="/">
                                <a>Old Felony</a>
                            </Link>
                        </Logo>

                        <Nav>
                            <Link href="/shop">
                                <a onClick={setDefaultFilters}>Shop</a>
                            </Link>
                            <Link href="/blog">
                                <a>Blog</a>
                            </Link>
                            <a>About</a>
                            <a>Contact</a>
                        </Nav>

                        <Cart onClick={() => Router.pushRoute('/cart')}>
                            {(cart && cart.length > 0) && <Count>{cart.length}</Count>}
                            <img src={cartIcon} />
                        </Cart>

                        {/*{!user ?
                            <div className="auth">
                                <a onClick={() => this.setState({createAccountVisible: true})}>Create account</a>
                                {!noSignIn && (
                                    <>
                                        <span className="spacer">|</span>
                                        <a onClick={() => this.setState({signInVisible: true})}>Sign in</a>
                                    </>
                                )}
                            </div> :
                            <div className="auth">
                                <Link href="/user"><a className="email">{user.email}</a></Link>
                                <span className="spacer">|</span>
                                <a onClick={this.signOut}>Sign out</a>
                            </div>
                        }*/}
                    </Inner>
                </Wrapper>

                <Modal noPadding visible={createAccountVisible} onClose={() => this.setState({createAccountVisible: false})}>
                    <CreateAccount close={() => this.setState({createAccountVisible: false})} />
                </Modal>

                <Modal noPadding visible={signInVisible} onClose={() => this.setState({signInVisible: false})}>
                    <SignIn close={() => this.setState({signInVisible: false})} />
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    cart: state.shop.cart
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        signOut,
        setDefaultFilters
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Header)


const Wrapper = styled.header`
    background: white;

    ${media.tablet} {
        border-bottom: 1px solid #eee;
    }
`

const Inner = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    text-align: center;

    ${media.tablet} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
    }
`

const Nav = styled.div`
    display: flex;
    border: 1px solid #eee;
    border-width: 1px 0;
    flex-basis: 320px;
    justify-content: space-between;
    list-style-type: none;
    user-select: none;

    ${media.tablet} {
        border: 0;
    }
    
    a {

        flex: 1;
        padding: 15px 15px;
        font-size: .9em;
        text-transform: uppercase;
        color: #222;
        cursor: pointer;
        text-decoration: none;
        transition: .1s ease;

        ${media.tablet} {
            padding: 20px 15px;
        }

        &:hover {
            background: #222;
            color: white;
        }

    }
`

const Logo = styled.div`
    font-family: 'Pacifico', cursive;
    margin: 10px 0;
    user-select: none;

    ${media.tablet} {
        margin: 0;
    }

    a {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #444;
        font-size: 1.26em;
        letter-spacing: 1px;
        text-decoration: none;
    }
`

const Cart = styled.button`
    position: absolute;
    top: 0;
    right: 18px;
    background: transparent;
    border: 0;
    cursor: pointer;

    ${media.tablet} {
        position: relative;
        right: 0;
        margin: 10px 10px 10px 70px;
    }

    img {
        width: 24px;
        height: 24px;
    }
`

const Count = styled.span`
    position: absolute;
    top: -5px;
    right: -2px;
    width: 15px;
    height: 15px;
    line-height: 15px;
    background: indianred;
    color: white;
    font-size: .6em;
    font-weight: 300;
    border-radius: 50%;
`
