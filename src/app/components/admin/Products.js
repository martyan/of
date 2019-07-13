import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateConfig, getConfig } from '../../lib/shop/actions'
import { Link, Router } from '../../../functions/routes'
import styled from 'styled-components'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { media } from '../common/variables'
import sortProducts from '../utils/sortProducts'
import Carousel, { Modal, ModalGateway } from 'react-images'

const SortableItem = SortableElement(({ item, index, loading, reorder, onReorder, onStock, onManageImgs, onEdit, onDelete }) => {
    const [carouselVisible, setCarouselVisible] = useState(false)
    const [carouselIndex, setCarouselIndex] = useState(0)

    const openImageInModal = (imageIndex) => {
        setCarouselVisible(true)
        setCarouselIndex(imageIndex)
    }

    return (
        <Product>
            <Head>
                <div className="index">{index + 1}</div>
                <div className="name">{item.name}</div>
                <div className="price">CZK {item.price}</div>
            </Head>

            <Category>
                {item.gender === 'men' && <i className="fa fa-mars"></i>}
                {item.gender === 'women' && <i className="fa fa-venus"></i>}
                {item.gender === 'uni' && <i>UNI</i>}
                <span>{item.category}</span>
            </Category>

            {item.photos.length > 0 && (
                <div>
                    <Photos>
                        {item.photos.map((photo, i) => <div key={i} className="photo" onClick={() => openImageInModal(i)}><img src={photo} /></div>)}
                    </Photos>
                    <ModalGateway>
                        {carouselVisible ? (
                            <Modal onClose={() => setCarouselVisible(false)}>
                                <Carousel
                                    currentIndex={carouselIndex}
                                    views={item.photos.map(photo => ({source: photo}))}
                                />
                            </Modal>
                        ) : null}
                    </ModalGateway>
                </div>
            )}

            <Actions>
                {reorder ?
                    <button onClick={() => onReorder(!reorder)}>
                        <i className="fa fa-arrows-v"></i>
                        <span>Done</span>
                    </button> :
                    <>
                        <Link to={`/product/${item.id}`}>
                            <a target="_blank">
                                <i className="fa fa-external-link"></i>
                                <span>View</span>
                            </a>
                        </Link>
                        <button onClick={() => onStock(item.id)}>
                            <i className="fa fa-cart-plus"></i>
                            <span>Stock</span>
                        </button>
                        <button onClick={() => onManageImgs(item.id)}>
                            <i className="fa fa-picture-o"></i>
                            <span>Photos</span>
                        </button>
                        <button onClick={() => onEdit(item.id)}>
                            <i className="fa fa-pencil"></i>
                            <span>Edit</span>
                        </button>
                        <button onClick={() => onDelete(item.id)}>
                            <i className="fa fa-trash"></i>
                            <span>Delete</span>
                        </button>
                        <button onClick={() => onReorder(!reorder)}>
                            <i className="fa fa-arrows-v"></i>
                            <span>Reorder</span>
                        </button>
                    </>
                }
            </Actions>
        </Product>
    )
})

const SortableList = SortableContainer(({ items, ...props }) => (
    <div>
        {items.map((item, index) => (
            <SortableItem
                key={`item-${index}`}
                index={index}
                item={item}
                disabled={!props.reorder}
                {...props}
            />
        ))}
    </div>
))

const Products = ({ products, onEdit, onDelete, onManageImgs, onStock, updateConfig, getConfig, configs }) => {
    const [items, setItems] = useState([])
    const [reorder, setReorder] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let items = [...products]
        if(configs.order) items = sortProducts(items, configs.order)
        setItems(items)
    }, [products, configs])

    const saveReordering = () => {
        setLoading(true)

        const data = {
            name: 'order',
            order: items.map(item => item.id)
        }

        updateConfig('order', data)
            .then(() => getConfig('order'))
            .then(() => setLoading(false))
            .catch(console.error)
    }

    const toggleReorder = (reorder) => {
        if(!reorder) saveReordering()

        setReorder(reorder)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex))
    }

    return (
        <SortableList
            items={items}
            onSortEnd={onSortEnd}
            loading={loading}
            reorder={reorder}
            onReorder={toggleReorder}
            onStock={onStock}
            onManageImgs={onManageImgs}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    )
}

Products.propTypes = {
    updateConfig: PropTypes.func.isRequired,
    getConfig: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onManageImgs: PropTypes.func.isRequired,
    onStock: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    configs: state.shop.configs
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        updateConfig,
        getConfig
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Products)


const Product = styled.div`
    background: white;
    padding: 15px;
    border: 1px solid #eee;
    margin-bottom: 20px;
`

const Head = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .index {
        flex-basis: 20px;
        margin-right: 5px;
        font-size: .75em;
    }

    .name {
        flex: 1;
        font-family: 'Roboto Slab', serif;
        font-weight: 500;
    }

    .price {
        font-weight: 300;
        font-size: .95em;
    }
`

const Category = styled.div`
    font-weight: 300;
    color: #888;
    font-size: .95em;

    i {
        width: 20px;
        margin-right: 5px;
        font-weight: 500;
    }
`

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    button, a {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
        background: transparent;
        text-decoration: none;
        border: 0;
        color: #ccc;
        cursor: pointer;
        transition: .1s ease;

        ${media.tablet} {
            color: #ddd;
        }

        &:last-child {
            margin-right: 0;
        }

        &:hover {
            color: #222;
        }

        i {
            font-size: 1.2em;
            margin-bottom: 3px;
        }

        span {
            font-size: .7em;
            max-width: 66px;
            text-align: center;
        }
    }
`

const Photos = styled.div`
    display: flex;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 20px;

    .photo {

        opacity: .8;
        margin-right: 5px;

        img {
            height: 100px;
        }

    }
`
