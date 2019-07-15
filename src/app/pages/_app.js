import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import createStore from '../lib/store'
import { ThemeProvider } from 'styled-components'
import { StripeProvider } from 'react-stripe-elements'
import Router from 'next/dist/client/router'
import { PageTransition } from 'next-page-transitions'
import { setCart } from '../lib/shop/actions'
import '../components/common/global.scss'

const theme = {
    colors: {
        primary: '#0070f3'
    }
}

class MyApp extends App {

    state = {
        stripe: null
    }

    componentDidMount() {
        Router.events.on('routeChangeComplete', () => {
            //scroll to top on page change
            try {
                window.scrollTo(0, 0)
            } catch(error) {}
        })

        this.loadStripe()
        this.loadFromLS()
    }

    loadFromLS = () => {
        try {
            const { store } = this.props
            const cart = localStorage.getItem('cart')
            if(cart) store.dispatch(setCart(JSON.parse(cart)))
        } catch(error) {}
    }

    loadStripe = () => {
        const stripeJs = document.createElement('script')
        stripeJs.src = 'https://js.stripe.com/v3/'
        stripeJs.async = true
        stripeJs.onload = () => this.setState({stripe: window.Stripe(process.env.STRIPE_API_KEY)})
        document.body && document.body.appendChild(stripeJs)
    }

    render () {
        const { Component, pageProps, store, router } = this.props

        return (
            <Container>
                <ThemeProvider theme={theme}>
                    <StripeProvider stripe={this.state.stripe}>
                        <Provider store={store}>
                            <>
                                <PageTransition
                                    timeout={500}
                                    classNames="page-transition"
                                    loadingDelay={5000}
                                >
                                    <Component {...pageProps} key={router.route} />
                                </PageTransition>

                                <style jsx global>{`
                                  .page-transition-enter {
                                    opacity: .65;
                                  }
                                  .page-transition-enter-active {
                                    opacity: 1;
                                    transition: opacity 500ms;
                                  }
                                  .page-transition-exit {
                                    opacity: 1;
                                  }
                                  .page-transition-exit-active {
                                    opacity: .65;
                                    transition: opacity 500ms;
                                  }
                                `}</style>
                            </>
                        </Provider>
                    </StripeProvider>
                </ThemeProvider>
            </Container>
        )
    }

}

export default withRedux(createStore)(MyApp)
