import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import createStore from '../lib/store'
import { ThemeProvider } from 'styled-components'
import Router from 'next/dist/client/router'
import { PageTransition } from 'next-page-transitions'

const theme = {
    colors: {
        primary: '#0070f3'
    }
}

class MyApp extends App {

    componentDidMount() {
        const { dispatch } = this.props.store
        Router.events.on('routeChangeComplete', () => {
            //scroll to top on page change
            try {
                window.scrollTo(0, 0)
            } catch(error) {}
        })
    }

    render () {
        const { Component, pageProps, store, router } = this.props

        return (
                <Container>
                    <ThemeProvider theme={theme}>
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
                    </ThemeProvider>
                </Container>
        )
    }

}

export default withRedux(createStore)(MyApp)
