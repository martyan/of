import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { createProduct, updateProduct, getProducts } from '../../lib/shop/actions'
import Select from 'react-select'
import Button from '../common/Button'
import TextInput from '../common/TextInput'
import { getSizes } from './Stock'


const getCategoryOptions = () => [
    { value: 'tshirt', label: 'T-shirt' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'skateboard', label: 'Skate deck' }
]

class EditProduct extends Component {

    static propTypes = {
        close: PropTypes.func.isRequired,
        product: PropTypes.object
    }

    state = {
        category: '',
        name: '',
        description: '',
        quantity: {},
        gender: '',
        price: '',
        nameError: '',
        priceError: '',
        serverError: '',
        submitted: false,
        loading: false,
    }

    componentDidMount() {
        if(this.isEditing()) this.loadForm()
    }

    loadForm = () => {
        const { category, name, description, quantity, gender, price } = this.props.product

        this.setState({
            category: getCategoryOptions().find(option => option.value === category),
            name,
            description,
            quantity,
            gender,
            price: String(price)
        })
    }

    handleCategoryChange = (category) => {
        const sizes = getSizes(category.value)

        const quantity = {}
        sizes.map(size => quantity[size.value] = 0)

        this.setState({
            category,
            quantity
        })
    }

    handleQuantityChange = (key, value) => {
        const { quantity } = this.state

        if(value < 0) return

        this.setState({
            quantity: {
                ...quantity,
                [key]: value
            }
        })
    }

    isEditing = () => !!this.props.product

    handleSubmit = (e) => {
        e.preventDefault()
        const { createProduct, updateProduct, getProducts, close, product } = this.props
        const { category, name, description, quantity, gender, price } = this.state

        this.setState({submitted: true})

        const data = {
            name,
            description,
            quantity,
            gender,
            price: parseInt(price)
        }

        if(!this.isEditing()) {
            data.category = category.value
            data.photos = []
        }

        if(this.isFormValid()) {
            this.setState({ loading: true })

            if(this.isEditing()) {
                return updateProduct(product.id, data)
                    .then(getProducts)
                    .then(close)
                    .catch(this.handleError)
            }

            return createProduct(data)
                .then(getProducts)
                .then(close)
                .catch(this.handleError)
        }

    }

    getValidation = (type, value) => {
        switch(type) {
            case 'name':
                if(!value.length) return 'Field is required'
                return ''
            case 'price':
                if(isNaN(parseInt(value))) return 'Should be a number'
                return ''
            default:
                return ''
        }
    }

    validateInput = (key, value) => {
        const error = this.getValidation(key, value)
        this.setState({[key+'Error']: error})
        return error
    }

    isFormValid = () => {
        const { category, name, price } = this.state

        const nameError = this.validateInput('name', name)
        const nameValid = nameError.length === 0

        const priceError = this.validateInput('price', price)
        const priceValid = priceError.length === 0

        const categoryValid = category !== ''

        return nameValid && categoryValid && priceValid
    }

    handleError = (error) => {
        this.setState({serverError: error.code, loading: false})
    }

    render = () => {
        const { product } = this.props
        const { category, name, description, quantity, gender, price, nameError, priceError, loading, submitted } = this.state

        const categoryOptions = getCategoryOptions()

        const sizes = getSizes(category.value)

        const isGenderSet = gender !== ''
        const isCategorySet = category !== ''

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <h1>{product ? 'Edit product' : 'Add product'}</h1>

                    <div>
                        <Gender type="button" onClick={() => this.setState({gender: 'men'})} selected={gender === 'men'}>Men</Gender>
                        <Gender type="button" onClick={() => this.setState({gender: 'women'})} selected={gender === 'women'}>Women</Gender>
                        <Gender type="button" onClick={() => this.setState({gender: 'uni'})} selected={gender === 'uni'}>UNI</Gender>
                    </div>

                    {(isGenderSet && !this.isEditing()) && (  //we don't want to change category when editing because it would change the stock
                        <Select
                            options={categoryOptions}
                            value={category}
                            onChange={this.handleCategoryChange}
                            placeholder="Select category"
                            className="category"
                            classNamePrefix="category-select"
                            isSearchable={false}
                        />
                    )}

                    {isCategorySet && (
                        <>
                            <TextInput
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={name => this.setState({name})}
                                error={submitted ? nameError : ''}
                                validate={value => this.validateInput('name', value)}
                            />

                            <TextArea
                                placeholder="Description"
                                value={description}
                                onChange={e => this.setState({description: e.target.value})}
                            />

                            <Price>
                                <div className="label">CZK</div>
                                <TextInput
                                    type="number"
                                    placeholder="Price"
                                    value={price}
                                    onChange={price => this.setState({price})}
                                    error={submitted ? priceError : ''}
                                    validate={value => this.validateInput('price', value)}
                                    min={0}
                                    max={99999}
                                    style={{marginBottom: '30px'}}
                                />
                            </Price>

                            {!this.isEditing && (
                                <Sizes>
                                    <p>Stock</p>
                                    {sizes.map(size => (
                                        <Size key={size.value} highlighted={quantity[size.value] > 0}>
                                            <label>{size.label}</label>
                                            <div>
                                                <button type="button" onClick={() => this.handleQuantityChange(size.value, quantity[size.value] - 1)}>-</button>
                                                <input
                                                    type="number"
                                                    value={quantity[size.value]}
                                                    onChange={e => this.handleQuantityChange(size.value, e.target.value)}
                                                    min={0}
                                                />
                                                <button type="button" onClick={() => this.handleQuantityChange(size.value, quantity[size.value] + 1)}>+</button>
                                            </div>
                                        </Size>
                                    ))}
                                </Sizes>
                            )}

                            <Button loading={loading} style={{marginBottom: 0}}>{product ? 'Save' : 'Add product'}</Button>
                        </>
                    )}
                </Form>

                <style jsx global>{`
                     .category {
                        margin-bottom: 20px !important;
                     }
                     .category-select__control {
                        border-color: #222 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                     }
                     .category-select__control:hover {
                        border-color: #222 !important;
                     }
                     .category-select__option {
                        font-weight: 300 !important;
                        color: #222 !important;
                        font-size: .95em !important;
                     }
                     .category-select__option:active {
                        background: #222 !important;
                        color: white !important;
                     }
                     .category-select__option--is-focused {
                        background: #eee !important;
                     }
                     .category-select__indicator-separator {
                        background-color: #222 !important;
                     }
                     .category-select__placeholder {
                        color: #222 !important;
                        font-weight: 300 !important;
                        font-size: .95em !important;
                     }
                     .category-select__indicator, .category-select__indicator:hover {
                        color: #222 !important;
                     }
                     .category-select__single-value {
                        font-weight: 300 !important;
                     }
                     .category-select__menu {
                        border-radius: 0 !important;
                     }
                     .category-select__option--is-selected {
                        background-color: #222 !important;
                        color: white !important;
                     }
                `}</style>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createProduct,
        updateProduct,
        getProducts
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct)


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

const TextArea = styled.textarea`
    display: block;
    width: 100%;
    min-height: 100px;
    border: 1px solid #222;
    padding: 10px;
    margin-bottom: 20px;
    font-weight: 300;
    font-size: .95em;
    resize: vertical;
`

const Gender = styled.button`
    width: calc(100% / 3);
    background: ${({selected}) => selected ? '#222' : 'white'};
    color: ${({selected}) => selected ? 'white' : '#222'};
    border: 1px solid #222;
    padding: 10px 15px;
    font-weight: 300;
    font-size: .95em;
    cursor: pointer;
    margin-bottom: 20px;
    
    &:nth-child(2) {
        border-width: 1px 0;
    }
    
    &:hover {
        background: ${({selected}) => selected ? '#222' : '#444'};
        color: white;
    }
`

const Price = styled.div`
    position: relative;
    
    .label {
        position: absolute;
        right: 0;
        top: 0;
        width: 50px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        font-weight: 300;
        color: #222;
    }
`

const Sizes = styled.div`
    margin-bottom: 50px;
    
    p {
        font-weight: 300;
        color: #222;
    }
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