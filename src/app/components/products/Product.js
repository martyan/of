import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { media } from '../common/variables'
import Router from 'next/router'
import ImageGallery from 'react-image-gallery'
import { addToCart } from '../../lib/shop/actions'
import { imgs } from '../../fakeData'
import 'react-image-gallery/styles/scss/image-gallery.scss'
import './Product.scss'

class Product extends Component {

    static propTypes = {
        product: PropTypes.object.isRequired,
        addToCart: PropTypes.func.isRequired
    }

    state = {
        size: 'm'
    }

    back = () => {
        Router.push('/shop')
    }

    render = () => {
        const { product, addToCart } = this.props

        const isActive = size => size === this.state.size

        const images = imgs.map(img => ({
            original: img,
            thumbnail: img
        }))

        const settings = {
            showPlayButton: false,
            showFullscreenButton: false,
            thumbnailPosition: 'left'
        }

        return (
            <Wrapper>
                <NameMobile><Back onClick={this.back}>{chevronLeft}</Back> {product.name}</NameMobile>

                <Gallery>
                    <ImageGallery {...settings} items={images} />
                </Gallery>

                <div>
                    <NameTablet><Back onClick={this.back}>{chevronLeft}</Back> {product.name}</NameTablet>
                    <Description>{product.description}</Description>
                    <Price>CZK {product.price}</Price>
                    <Sizes>
                        <Size className={isActive('s') ? 'size active' : 'size'} onClick={() => this.setState({size: 's'})}>S</Size>
                        <Size className={isActive('m') ? 'size active' : 'size'} onClick={() => this.setState({size: 'm'})}>M</Size>
                        <Size className={isActive('l') ? 'size active' : 'size'} onClick={() => this.setState({size: 'l'})}>L</Size>
                        <Size className={isActive('xl') ? 'size active' : 'size'} onClick={() => this.setState({size: 'xl'})}>XL</Size>
                    </Sizes>
                    <AddToCart onClick={() => addToCart({id: 'hovno'})}>Add to cart</AddToCart>
                </div>
            </Wrapper>
        )
    }

}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        addToCart
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Product)


const chevronLeft = <svg viewBox="0 0 8 12">
    <g>
        <path d="M5.4,0.7c0.9-0.6,1.9-0.9,2.4-0.6S7.9,1.4,7.1,2L2.4,5.8c-0.9,0.7-1.8,1-2.3,0.6S0.1,5.3,0.9,4.6L5.4,0.7z"/>
        <path d="M7.1,9.9c0.8,0.7,1.2,1.6,0.8,1.9s-1.4,0.1-2.3-0.6L0.9,7.4C0.1,6.7-0.2,5.9,0.2,5.5s1.4-0.1,2.3,0.6L7.1,9.9z"/>
    </g>
</svg>

const Wrapper = styled.div`
    padding: 15px;
    max-width: 1280px;
    margin: 30px auto 0;
    
    ${media.tablet} {
        display: flex;
    }
`

const Gallery = styled.div`
    margin-bottom: 30px;
    flex-shrink: 0;    
    
    ${media.tablet} {
        display: flex;
        width: calc(50% - 50px);
        margin-right: 50px;
    }
`

const NameMobile = styled.div`
    font-size: 2em;
    color: #222;
    font-family: 'Roboto Slab', serif;
    margin-bottom: 30px;
    
    ${media.tablet} {
        display: none;
    }
`

const NameTablet = styled.div`
    display: none;
    
    ${media.tablet} {
        display: block;
        font-size: 2em;
        color: #222;
        font-family: 'Roboto Slab', serif;
        margin-bottom: 30px;
    }
`

const Back = styled.button`
    height: 25px;
    line-height: 25px;
    background: transparent;
    border: none;
    cursor: pointer;
    
    &:hover svg {
        transform: translateX(-4px);
    }
    
    svg {
        height: 100%;
        transition: .2s ease;
    }
`

const Description = styled.div`
    margin-bottom: 30px;
    font-weight: 300;
    line-height: 150%;
    color: #222;
`

const Price = styled.div`
    font-size: 1.2em;
    font-family: 'Roboto Slab', serif;
    margin-bottom: 30px;
    color: #222;
`

const Sizes = styled.div`
    display: flex;
`

const Size = styled.button`
    margin-right: 5px;
    margin-bottom: 30px;
    flex-basis: 28px;
    height: 28px;
    line-height: 25px;
    text-align: center;
    color: #222;
    background: white;
    border: 1px solid #444;
    cursor: pointer;
    transition: .2s ease;

    &.active, &:hover {
        color: white;
        background: #222;
        border-color: transparent;
    }
`

const AddToCart = styled.button`
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    background: white;
    color: #222;
    font-weight: 300;
    border: 1px solid #222;
    border-radius: 0;
    cursor: pointer;
    transition: .2s ease;
    
    &:hover {
        background: #222;
        color: white;
    }
    
    ${media.tablet} {
        margin: 0;
        max-width: 320px;
    }
`
