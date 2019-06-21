import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router } from '../../../functions/routes'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setFilter } from '../../lib/shop/actions'
import FlipMove from 'react-flip-move'
import Check from '../common/Check'
import { products } from '../../fakeData'
import './ProductList.scss'

class ProductList extends Component {

    static propTypes = {
        setFilter: PropTypes.func.isRequired
    }

    filterProduct = (product) => {
        const { men, women, tshirt, sweatshirt } = this.props.filters

        const isMen = men && product.gender === 'male'
        const isWomen = women && product.gender === 'female'

        const isTshirt = tshirt && product.type === 'tshirt'
        const isSweatshirt = sweatshirt && product.type === 'sweatshirt'

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
                                    <img src={product.img} alt={product.name}/>
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
