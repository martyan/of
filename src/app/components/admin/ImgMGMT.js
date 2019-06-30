import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateProduct, getProducts } from '../../lib/shop/actions'
import styled from 'styled-components'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import Modal from '../common/Modal'
import ImgUpload from './ImgUpload'
import Button from '../common/Button'
import { media } from '../common/variables'

const SortableItem = SortableElement(({ item, loading, reorder, onDeleteClick }) => (
    <Photo>
        {!reorder && <Delete loading={loading} onClick={onDeleteClick}><i className="fa fa-trash"></i></Delete>}
        <img src={item} />
    </Photo>
))

const SortableList = SortableContainer(({ items, loading, reorder, setUploadVisible, onDeleteClick }) => (
    <Photos>
        {items.map((item, index) => (
            <SortableItem
                key={`item-${index}`}
                index={index}
                item={item}
                disabled={!reorder}
                onDeleteClick={() => onDeleteClick(index)}
                loading={loading}
                reorder={reorder}
            />
        ))}
        {!reorder && <Add onClick={() => setUploadVisible(true)}>+</Add>}
    </Photos>
))


const ImgMGMT = ({ product, close, updateProduct, getProducts }) => {
    const [items, setItems] = useState([])
    const [reorder, setReorder] = useState(false)
    const [uploadVisible, setUploadVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setItems(product.photos)
    }, [product])

    const updateProductPhotos = (photos) => {
        setLoading(true)

        const data = {
            photos: [...product.photos, ...photos]
        }

        updateProduct(product.id, data)
            .then(getProducts)
            .then(() => {
                setUploadVisible(false)
                setLoading(false)
            })
            .catch(console.error)
    }

    const saveReordering = () => {
        setLoading(true)

        const data = {
            photos: [...items]
        }

        updateProduct(product.id, data)
            .then(getProducts)
            .then(() => {
                setReorder(false)
                setLoading(false)
            })
            .catch(console.error)
    }

    const deletePhoto = (index) => {
        setLoading(true)

        const data = {
            photos: product.photos.filter((photo, i) => i !== index)
        }

        updateProduct(product.id, data)
            .then(getProducts)
            .then(() => {
                setLoading(false)
            })
            .catch(console.error)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex))
    }

    return (
        <div>
            <Wrapper>
                <h1>Photo management</h1>

                {reorder && <Button loading={loading} onClick={saveReordering}>Save</Button>}
                {(!reorder && items.length > 1) && <Button loading={loading} onClick={() => setReorder(true)}>Reorder</Button>}

                <SortableList
                    axis="xy"
                    items={items}
                    onSortEnd={onSortEnd}
                    reorder={reorder}
                    loading={loading}
                    setUploadVisible={setUploadVisible}
                    onDeleteClick={deletePhoto}
                />

                {reorder && <Button loading={loading} style={{margin: '30px 0 0 0'}} onClick={saveReordering}>Save</Button>}
            </Wrapper>

            <Modal visible={uploadVisible} onClose={() => setUploadVisible(false)}>
                <ImgUpload
                    path={`products/${product.id}`}
                    onCompleted={updateProductPhotos}
                />
            </Modal>
        </div>
    )
}

ImgMGMT.propTypes = {
    product: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        updateProduct,
        getProducts
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ImgMGMT)


const Wrapper = styled.div`
    h1 {
        font-family: 'Roboto Slab', serif;
        font-size: 1.25em;
        font-weight: 500;
        margin: 10px 0 30px;
        text-align: center;
        color: #222;
    }
`

const Photos = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    opacity: .8;
`

const Add = styled.li`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-basis: calc((100% / 3) - 10px);
    margin: 5px;
    min-width: 280px;
    min-height: 100px;
    list-style-type: none;
    color: #222;
    font-weight: 300;
    font-size: 3em;
    border: 2px solid transparent;
    cursor: pointer;
    transition: .2s ease;
    
    &:hover {
        border-color: #222;
    }
`

const Photo = styled.li`
    flex-basis: calc((100% / 2) - 10px);
    flex-shrink: 0;
    flex-grow: 0;
    margin: 5px;
    list-style-type: none;
    position: relative;
    z-index: 99999;
    
    ${media.tablet} {
        flex-basis: calc((100% / 3) - 10px);
    }
    
    ${media.desktop} {
        flex-basis: calc((100% / 4) - 10px);
    }
    
    img {
        display: block;
        width: 100%;
    }
`

const Delete = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background: #222;
    color: white;
    text-align: center;
    font-size: 1.1em;
    border: 0;
    cursor: pointer;
    opacity: ${({loading}) => loading ? '.2' : '1'};
    transition: .1s ease;
    
    &:hover {
        background: #000;
    }
`
