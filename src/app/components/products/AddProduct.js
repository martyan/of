import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { createProduct } from '../../lib/shop/actions'
import Select from 'react-select'
import Button from '../common/Button'
import TextInput from '../common/TextInput'

const getSizes = (category) => {
    switch(category) {
        case 'tshirt':
        case 'sweatshirt':
            return [
                {value: 's', label: 'S'},
                {value: 'm', label: 'M'},
                {value: 'L', label: 'L'},
                {value: 'XL', label: 'XL'}
            ]
        case 'skateboard':
            return [{value: 'eight', label: '8"'}]
        default:
            return []
    }
}

class AddProduct extends Component {

    static propTypes = {
        createProduct: PropTypes.func.isRequired
    }

    state = {
        id: '',
        category: '',
        name: '',
        description: '',
        quantity: {},
        gender: 'men',
        price: '',
        nameError: '',
        priceError: '',
        serverError: '',
        submitted: false,
        loading: false,
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

    handleSubmit = (e) => {
        e.preventDefault()
        const { createProduct, close } = this.props
        const { id, category, name, description, quantity, gender, price } = this.state

        this.setState({submitted: true})

        const product = {
            id,
            category: category.value,
            name,
            description,
            quantity,
            gender,
            price: parseInt(price)
        }

        if(this.isFormValid()) {
            this.setState({ loading: true })

            createProduct(product)
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
        const { category, name, description, quantity, gender, price, nameError, priceError, loading, submitted } = this.state

        const options = [
            { value: 'tshirt', label: 'T-shirt' },
            { value: 'sweatshirt', label: 'Sweatshirt' },
            { value: 'skateboard', label: 'Skate deck' }
        ]

        const sizes = getSizes(category.value)

        return (
            <Wrapper>
                <Form onSubmit={this.handleSubmit}>
                    <h1>Add product</h1>

                    <div>
                        <Gender type="button" onClick={() => this.setState({gender: 'men'})} selected={gender === 'men'}>Men</Gender>
                        <Gender type="button" onClick={() => this.setState({gender: 'women'})} selected={gender === 'women'}>Women</Gender>
                        <Gender type="button" onClick={() => this.setState({gender: 'uni'})} selected={gender === 'uni'}>UNI</Gender>
                    </div>

                    <Select
                        options={options}
                        value={category}
                        onChange={this.handleCategoryChange}
                        placeholder="Select category"
                        className="category"
                        classNamePrefix="category-select"
                        isSearchable={false}
                    />

                    {category !== '' && (
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

                            <Sizes>
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

                            <TextInput
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={price => this.setState({price})}
                                error={submitted ? priceError : ''}
                                validate={value => this.validateInput('price', value)}
                                min={0}
                                max={99999}
                                style={{marginBottom: '50px'}}
                            />

                            <Button loading={loading} style={{marginBottom: 0}}>Add product</Button>
                        </>
                    )}
                </Form>

                <style jsx global>{`
                     .category {
                        margin-bottom: 20px;
                     }
                     .category-select__control {
                        border-color: #222;
                        border-radius: 0;
                        box-shadow: none;
                     }
                     .category-select__control:hover {
                        border-color: #222;
                     }
                     .category-select__option {
                        font-weight: 300;
                        color: #222;
                        font-size: .95em;
                     }
                     .category-select__option:active {
                        background: #222;
                        color: white;
                     }
                     .category-select__option--is-focused {
                        background: #eee;
                     }
                     .category-select__indicator-separator {
                        background-color: #222;
                     }
                     .category-select__placeholder {
                        color: #222;
                        font-weight: 300;
                        font-size: .95em;
                     }
                     .category-select__indicator, .category-select__indicator:hover {
                        color: #222;
                     }
                     .category-select__single-value {
                        font-weight: 300;
                     }
                     .category-select__menu {
                        border-radius: 0;
                     }
                     .category-select__option--is-selected {
                        background-color: #222;
                        color: white;
                     }
                `}</style>
            </Wrapper>
        )
    }

}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        createProduct
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct)


const Wrapper = styled.div`
    padding: 15px;
    max-width: 1280px;
    margin: 0 auto;
`

const Form = styled.form`
    max-width: 420px;
    margin: 0 auto;
    
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

const Sizes = styled.div`
    margin-bottom: 20px;
`

const Size = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    
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
