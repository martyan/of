import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router } from '../../../functions/routes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setFilter } from '../../lib/shop/actions'
import FlipMove from 'react-flip-move'
import Check from '../common/Check'
import './ProductList.scss'

class ProductList extends Component {

    static propTypes = {
        products: PropTypes.arrayOf(PropTypes.object).isRequired,
        setFilter: PropTypes.func.isRequired
    }

    filterProduct = (product) => {
        const { men, women, tshirt, sweatshirt } = this.props.filters

        const isMen = men && product.gender === 'men'
        const isWomen = women && product.gender === 'women'

        const isTshirt = tshirt && product.category === 'tshirt'
        const isSweatshirt = sweatshirt && product.category === 'sweatshirt'

        return (isMen || isWomen) && (isTshirt || isSweatshirt)
    }

    toggleFilter = (filter1, filter2) => {
        const { setFilter, filters } = this.props

        if(filters[filter1] && !filters[filter2]) setFilter(filter2, true)
        setFilter(filter1, !filters[filter1])
    }

    handleProductClick = (productId) => {
        Router.push(`/product/${productId}`)
    }

    render = () => {
        const { products } = this.props
        const { men, women, tshirt, sweatshirt } = this.props.filters

        const filtered = products.filter(this.filterProduct)

        return (
            <div className="product-list">
                <div className="filters">
                    <div className="category">
                        <label className="filter">
                            <Check onChange={e => this.toggleFilter('men', 'women')} checked={men} />
                            <span>Men</span>
                        </label>

                        <label className="filter">
                            <Check onChange={e => this.toggleFilter('women', 'men')} checked={women} />
                            <span>Women</span>
                        </label>
                    </div>

                    <div className="category">
                        <label className="filter">
                            <Check onChange={e => this.toggleFilter('tshirt', 'sweatshirt')} checked={tshirt} />
                            <span>T-shirt</span>
                        </label>

                        <label className="filter">
                            <Check onChange={e => this.toggleFilter('sweatshirt', 'tshirt')} checked={sweatshirt} />
                            <span>Sweatshirt</span>
                        </label>
                    </div>
                </div>

                <div className="products">
                    <FlipMove>
                        {filtered.map(product => (
                            <div key={product.id} className="product" onClick={() => this.handleProductClick(product.id)}>
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
                        {filtered.length === 0 && <div className="nada">¯\_(ツ)_/¯</div>}
                    </FlipMove>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    filters: state.shop.filters
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        setFilter
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
