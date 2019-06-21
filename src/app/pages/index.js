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
import AddTodo from '../components/todo/AddTodo'
import TodoList from '../components/todo/TodoList'
import Footer from '../components/Footer'
import ProductList from '../components/products/ProductList'
import Slider from 'react-slick'
import Cover from '../components/products/Cover'
import coverImg from '../static/img/cover.jpg'
import cover2Img from '../static/img/cover2.jpg'
import cover3Img from '../static/img/cover3.jpg'
import cover4Img from '../static/img/cover4.jpg'
import cover5Img from '../static/img/cover5.jpg'
import cover6Img from '../static/img/cover6.jpg'
import './index.scss'

class Home extends React.Component {

    static propTypes = {
        getTodos: PropTypes.func.isRequired,
        user: PropTypes.object
    }

    static getInitialProps = async ({ store }) => {
        await store.dispatch(getTodos())
        return {}
    }

    render = () => {
        const settings = {
            infinite: true,
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 10000,
            // lazyLoad: true,
            pauseOnHover: false,
            autoplay: true,
            arrows: false,
            draggable: false,
            swipe: false
        }

        return (
            <PageWrapper>
                <div className="index">

                    <Head>
                        <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                        <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                        <title>Todo list | Nextbase</title>
                    </Head>

                    <Header />

                    <Slider {...settings}>
                        <div>
                            <Cover
                                start={70}
                                img={cover4Img}
                                location="Newquay, United Kingdom"
                                link="https://goo.gl/maps/gx2PnihqX4PxqndK7"
                            >
                                Riding&nbsp;everything. Everywhere.
                            </Cover>
                        </div>
                        <div>
                            <Cover
                                start={20}
                                img={coverImg}
                                location="Taghazout, Morocco"
                                link="https://goo.gl/maps/dfdDyEmEwnake9Gx9"
                            >
                                Respecting the&nbsp;ocean.
                            </Cover>
                        </div>
                        <div>
                            <Cover
                                start={70}
                                img={cover2Img}
                                location="Zlin, Czechia"
                                link="https://goo.gl/maps/VLJ1A7pvXFpEBdXa9"
                            >
                                Sailing&nbsp;down the&nbsp;roads.
                            </Cover>
                        </div>
                        <div>
                            <Cover
                                start={50}
                                img={cover3Img}
                                location="Rychleby trails, Czechia"
                                link="https://goo.gl/maps/WwpoyCDSyy1nrmb8A"
                            >
                                Li<span className="loving">o</span>ving the&nbsp;Earth...
                            </Cover>
                        </div>
                        <div>
                            <Cover
                                start={40}
                                img={cover6Img}
                                location="Taghazout, Morocco"
                                link="https://goo.gl/maps/dfdDyEmEwnake9Gx9"
                            >
                                ...living the dream.
                            </Cover>
                        </div>
                    </Slider>


                    <ProductList />

                    {/*<AddTodo />*/}

                    {/*<TodoList />*/}

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

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(Home)
