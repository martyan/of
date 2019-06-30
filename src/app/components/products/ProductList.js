import React, { Component, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Router } from '../../../functions/routes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setFilter } from '../../lib/shop/actions'
import FlipMove from 'react-flip-move'
import Check from '../common/Check'
import sortProducts from '../utils/sortProducts'
import './ProductList.scss'

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
        <div className="product-list">
            <div className="filters">
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
            </div>

            <div className="products">
                <FlipMove>
                    {sorted.map(product => (
                        <div key={product.id} className="product" onClick={() => handleProductClick(product.id)}>
                            <div className="photo">
                                {product.photos.length > 0 ?
                                    <img src={product.photos[0]} alt={product.name} /> :
                                    <img src="https://via.placeholder.com/900x1146/eee" />
                                }
                            </div>
                            <div className="caption">
                                <div className="name">{product.name}</div>
                                <div className="price">CZK {product.price}</div>
                            </div>
                        </div>
                    ))}
                    {sorted.length === 0 && <div className="nada">¯\_(ツ)_/¯</div>}
                </FlipMove>
            </div>
        </div>
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
