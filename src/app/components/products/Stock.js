import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { updateProduct, getProducts } from '../../lib/shop/actions'
import Button from '../common/Button'

export const getSizes = (category) => {
    switch(category) {
        case 'tshirt':
        case 'sweatshirt':
            return [
                {value: 's', label: 'S'},
                {value: 'm', label: 'M'},
                {value: 'l', label: 'L'},
                {value: 'xl', label: 'XL'}
            ]
        case 'skateboard':
            return [{value: 'eight', label: '8"'}]
        default:
            return []
    }
}

const Stock = ({ product, close, updateProduct, getProducts }) => {
    const [quantity, setQuantity] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setQuantity(product.quantity)
    }, [product])

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        const data = { quantity }

        return updateProduct(product.id, data)
            .then(getProducts)
            .then(close)
            .catch(console.error)
    }

    const handleQuantityChange = (key, value) => {
        if(value < 0) return

        setQuantity({
            ...quantity,
            [key]: value
        })
    }

    const sizes = getSizes(product.category)

    return (
        <Form onSubmit={handleSubmit}>
            <h1>Product stock</h1>

            <Sizes>
                {sizes.map(size => (
                    <Size key={size.value} highlighted={quantity[size.value] > 0}>
                        <label>{size.label}</label>
                        <div>
                            <button type="button" onClick={() => handleQuantityChange(size.value, quantity[size.value] - 1)}>-</button>
                            <input
                                type="number"
                                value={quantity[size.value]}
                                onChange={e => handleQuantityChange(size.value, e.target.value)}
                                min={0}
                            />
                            <button type="button" onClick={() => handleQuantityChange(size.value, quantity[size.value] + 1)}>+</button>
                        </div>
                    </Size>
                ))}
            </Sizes>

            <Button loading={loading} style={{marginBottom: 0}}>{product ? 'Save' : 'Add product'}</Button>
        </Form>
    )
}

Stock.propTypes = {
    close: PropTypes.func.isRequired,
    product: PropTypes.object
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        updateProduct,
        getProducts
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Stock)


const Form = styled.form`
    h1 {
        font-family: 'Roboto Slab', serif;
        font-size: 1.25em;
        font-weight: 500;
        margin: 10px 0 30px;
        text-align: center;
        color: #222;
    }
`

const Sizes = styled.div`
    margin-bottom: 50px;
`

const Size = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 10px;
    
    label {
        flex-basis: 28px;
        height: 28px;
        line-height: 25px;
        text-align: center;
        font-weight: 300;
        font-size: .95em;
        color: ${({highlighted}) => highlighted ? 'white' : '#222'};
        background: ${({highlighted}) => highlighted ? '#222' : 'white'};
        border: 1px solid #222;
        transition: .2s ease;
    }
    
    div {
        display: flex;
        justify-content: flex-end;
        flex-basis: 50%;
    }
    
    input {
        width: 100px;
        padding: 5px;
        border: 1px solid #222;
        color: #222;
        text-align: center;
        font-weight: 300;
    }    
    
    button {
        flex-basis: 40px;
        flex-shrink: 0;
        background: white;
        border: 1px solid #222;
        cursor: pointer;
        
        &:hover {
            background: #444;
            color: white;
        }
        
        &:first-child {
            border-right: 0;
        }
        
        &:last-child {
            border-left: 0;
        }
    }
`
