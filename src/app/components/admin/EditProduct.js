import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { createProduct, updateProduct, getProducts } from '../../lib/shop/actions'
import Select from 'react-select'
import Button from '../common/Button'
import TextInput from '../common/TextInput'
import { firebase } from '../../lib/firebase'
import { getSizes } from './Stock'


const getCategoryOptions = () => [
    { value: 'tshirt', label: 'T-shirt' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'skateboard', label: 'Skate deck' }
]

const EditProduct = ({ product, close, createProduct, updateProduct, getProducts }) => {
    const [category, setCategory] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState({})
    const [gender, setGender] = useState('')
    const [price, setPrice] = useState('')

    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const isEditing = !!product

    useEffect(() => {
        setCategory(getCategoryOptions().find(option => option.value === product.category))
        setName(product.name)
        setDescription(product.description)
        setQuantity(product.quantity)
        setGender(product.gender)
        setPrice(String(product.price))
    }, [product])

    const handleCategoryChange = (category) => {
        const sizes = getSizes(category.value)

        const updatedQuantity = {}
        sizes.map(size => updatedQuantity[size.value] = 0)

        setCategory(category)
        setQuantity(updatedQuantity)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setSubmitted(true)

        const data = {
            name,
            description,
            quantity,
            gender,
            price: parseInt(price)
        }

        if(!isEditing) {
            data.category = category.value
            data.photos = []
            data.createdAt = firebase.firestore.Timestamp.fromDate(new Date())
        }

        if(isFormValid()) {
            setLoading(true)

            if(isEditing) {
                return updateProduct(product.id, data)
                    .then(getProducts)
                    .then(close)
                    .catch(handleError)
            }

            return createProduct(data)
                .then(getProducts)
                .then(close)
                .catch(handleError)
        }

    }

    const getValidation = (type, value) => {
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

    const validateInput = (key, value) => {
        const error = getValidation(key, value)
        setErrors({...errors, [key]: error})
        return error
    }

    const isFormValid = () => {
        const nameError = validateInput('name', name)
        const nameValid = nameError.length === 0

        const priceError = validateInput('price', price)
        const priceValid = priceError.length === 0

        const categoryValid = category !== ''

        return nameValid && categoryValid && priceValid
    }

    const handleError = (error) => {
        setErrors({...errors, server: error.code})
        setLoading(false)
    }

    const categoryOptions = getCategoryOptions()

    const isGenderSet = gender !== ''
    const isCategorySet = category !== ''

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <h1>{isEditing ? 'Edit product' : 'Add product'}</h1>

                <div>
                    <Gender type="button" onClick={() => setGender('men')} selected={gender === 'men'}>Men</Gender>
                    <Gender type="button" onClick={() => setGender('women')} selected={gender === 'women'}>Women</Gender>
                    <Gender type="button" onClick={() => setGender('uni')} selected={gender === 'uni'}>UNI</Gender>
                </div>

                {(isGenderSet && !isEditing) && (  //we don't want to change category when editing because it would change the stock
                    <Select
                        options={categoryOptions}
                        value={category}
                        onChange={handleCategoryChange}
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
                            onChange={setName}
                            error={submitted ? errors.name : ''}
                            validate={value => validateInput('name', value)}
                        />

                        <TextArea
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />

                        <Price>
                            <div className="label">CZK</div>
                            <TextInput
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={setPrice}
                                error={submitted ? errors.price : ''}
                                validate={value => validateInput('price', value)}
                                min={0}
                                max={99999}
                                style={{marginBottom: '30px'}}
                            />
                        </Price>

                        <Button loading={loading} style={{marginBottom: 0}}>{isEditing ? 'Save' : 'Add product'}</Button>
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

EditProduct.propTypes = {
    close: PropTypes.func.isRequired,
    product: PropTypes.object
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
