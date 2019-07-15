import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Router } from '../../../functions/routes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setFilter } from '../../lib/shop/actions'
import FlipMove from 'react-flip-move'
import Check from '../common/Check'
import sortProducts from '../utils/sortProducts'
import { media } from '../common/variables'


const ProductList = ({ products, filters, setFilter, configs }) => {
    const { men, women, tshirt, sweatshirt, skateboard } = filters

    const filterProduct = (product) => {
        const { men, women, tshirt, sweatshirt, skateboard } = filters

        const isMen = men && product.gender === 'men'
        const isWomen = women && product.gender === 'women'
        const isUNI = (men || women) && product.gender === 'uni'

        const isTshirt = tshirt && product.category === 'tshirt'
        const isSweatshirt = sweatshirt && product.category === 'sweatshirt'
        const isSkateboard = skateboard && product.category === 'skateboard'

        return (isMen || isWomen || isUNI) && (isTshirt || isSweatshirt || isSkateboard)
    }

    const toggleFilter = (filter1, filter2) => {
        if(filter2 && filters[filter1] && !filters[filter2]) setFilter(filter2, true)
        setFilter(filter1, !filters[filter1])
    }

    const handleProductClick = (productId) => {
        Router.pushRoute(`/product/${productId}`)
    }

    const filtered = products.filter(filterProduct)
    const sorted = sortProducts(filtered, configs.order)

    return (
        <Container>
            <Filters>
                <div className="category">
                    <label className="filter">
                        <Check onChange={e => toggleFilter('men', 'women')} checked={men} />
                        <span>Men</span>
                    </label>

                    <label className="filter">
                        <Check onChange={e => toggleFilter('women', 'men')} checked={women} />
                        <span>Women</span>
                    </label>
                </div>

                <div className="category">
                    <label className="filter">
                        <Check onChange={e => toggleFilter('tshirt')} checked={tshirt} />
                        <span>T-shirt</span>
                    </label>

                    <label className="filter">
                        <Check onChange={e => toggleFilter('sweatshirt')} checked={sweatshirt} />
                        <span>Sweatshirt</span>
                    </label>
                    <label className="filter">
                        <Check onChange={e => toggleFilter('skateboard')} checked={skateboard} />
                        <span>Skate</span>
                    </label>
                </div>
            </Filters>

            <Products>
                <FlipMove>
                    {sorted.map(product => (
                        <div key={product.id} className="product" onClick={() => handleProductClick(product.id)}>
                            <div className="photo" style={{backgroundImage: `url(${product.photos.length > 0 ? product.photos[0] : 'https://via.placeholder.com/900x1146/eee'})`}}></div>
                            <div className="caption">
                                <div className="name">{product.name}</div>
                                <div className="price">CZK {product.price}</div>
                            </div>
                        </div>
                    ))}
                    {sorted.length === 0 && <div className="nada">¯\_(ツ)_/¯</div>}
                </FlipMove>
            </Products>
        </Container>
    )
}

ProductList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    configs: PropTypes.object.isRequired,
    setFilter: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    filters: state.shop.filters,
    configs: state.shop.configs
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        setFilter
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)


const Container = styled.div`
    max-width: 1280px;
    margin: 0 auto;
`

const Filters = styled.div`
    max-width: 640px;
    margin: 0 auto 50px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;

    ${media.tablet} {
        display: flex;
        justify-content: center;
        padding: 50px 0;
    }

    .category {
        display: flex;
        padding: 0 15px;
        border-right: 1px solid #eee;

        &:last-child {
            border-right: 0;
        }
    }

    .filter {
        flex: 1;
        justify-content: center;
        display: flex;
        align-items: center;
        font-size: .95em;
        color: #444;
        padding: 10px;
        cursor: pointer;
        user-select: none;

        ${media.tablet} {
            justify-content: center;
            padding: 15px;
        }
        
        span {
            flex-basis: 100px;
        }
    }
`

const Products = styled.div`
    max-width: 1280px;
    margin: 0 auto;

    & > div {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .nada {
        display: flex;
        align-items: center;
        height: 240px;
        padding: 25px;
        font-size: 1.1em;
        font-weight: 300;
        color: #ccc;
        text-align: center;

        ${media.tablet} {
            height: 360px;
            padding: 50px 15px;
            font-size: 1.3em;
        }
    }

    .product {
        width: 100%;
        max-width: 320px;
        margin: 0 10px 50px;
        cursor: pointer;
        user-select: none;

        @media (min-width: 500px) {
            width: 300px;
        }

        ${media.tablet} {
            margin: 0 25px 50px;

            &:hover .photo {
                opacity: 1;
                transform: scale(1.1);
            }
        }

        .photo {
            width: 100%;
            height: 382px;
            background-size: cover;
            background: no-repeat 50% 50%;
            transform-origin: 50% 100%;
            transition: transform .3s ease, opacity .3s ease;

            ${media.tablet} {
                opacity: .85;
            }

            img {
                height: 100%;
            }
        }

        .caption {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            color: #444;
            
            .name {
                font-size: 1.1em;
                font-weight: 300;
                letter-spacing: 1px;
            }

            .price {
                flex-basis: 100px;
                text-align: right;
            }
        }
    }
`
