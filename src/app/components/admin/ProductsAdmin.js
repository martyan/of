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
import { getSizes } from './Stock'

const SortableItem = SortableElement(({ item, index, loading, reorder, onReorder, onStock, onManageImgs, onEdit, onDelete }) => {
    const [carouselVisible, setCarouselVisible] = useState(false)

    const sizes = getSizes(item.category)

    return (
        <Product>
            <div className="index">{index + 1}</div>

            <div className="photo-wrapper" onClick={() => item.photos.length === 0 && onManageImgs(item.id)}>
                {item.photos.length > 0 && (
                    <div
                        className="photo"
                        onClick={() => setCarouselVisible(true)}
                        style={{backgroundImage: `url('${item.photos[0]}')`}}
                    ></div>
                )}
                <ModalGateway>
                    {carouselVisible ? (
                        <Modal onClose={() => setCarouselVisible(false)}>
                            <Carousel views={item.photos.map(photo => ({source: photo}))} />
                        </Modal>
                    ) : null}
                </ModalGateway>
            </div>

            <div className="desc">
                <Head>
                    <div className="name">{item.name}</div>
                    <div className="price">CZK {item.price}</div>
                </Head>

                <Category>
                    {item.gender === 'men' && <i className="fa fa-mars"></i>}
                    {item.gender === 'women' && <i className="fa fa-venus"></i>}
                    {item.gender === 'uni' && <i>UNI</i>}
                    <span>{item.category}</span>
                </Category>

                <Stock>
                    {sizes.map(size => (
                        <div key={size.value} className="size">
                            <span className="label">{size.label}</span>
                            <span className={item.quantity[size.value] === 0 ? 'value red' : 'value'}>{item.quantity[size.value]}</span>
                        </div>
                    ))}
                </Stock>

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
            </div>
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
    display: flex;
    position: relative;
    background: white;
    border: 1px solid #eee;
    margin-bottom: 80px;
    
    .index {
        position: absolute;
        left: 3px;
        top: 3px;
        z-index: 1;
        width: 20px;
        height: 20px;
        color: white;
        font-size: .7em;
        font-weight: 300;
        border-radius: 50%;
        opacity: .9;
        text-shadow: 0 0 10px black;
    }
    
    .photo-wrapper {
        flex-basis: 90px;
        flex-shrink: 0;
        background: #eee;
        
        ${media.tablet} {
            flex-basis: 130px;
        }
        
        .photo {
            width: 100%;
            height: 100%;
            opacity: .8;
            margin-right: 5px;
            background-size: cover;
        }
    
    }
    
    .desc {
        padding: 15px 10px 5px;
        flex: 1;
        
        ${media.tablet} {
            padding: 15px 15px 5px;
        }
    }
    
`

const Head = styled.div`
    display: flex;
    align-items: center;

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
        font-size: .9em;
        
        ${media.tablet} {
            font-size: 1em;
        }
    }
`

const Category = styled.div`
    font-weight: 300;
    color: #888;
    font-size: .95em;
    margin-top: 10px;

    i {
        width: 20px;
        margin-right: 5px;
        font-weight: 500;
    }
`

const Stock = styled.div`
    display: flex;    
    margin-top: 20px;
    justify-content: flex-end;
    flex-wrap: wrap;
    
    .size {
        margin-left: 15px;
        margin-bottom: 15px;
        
        .label {
            font-weight: 300;
            color: #222;
            padding: 4px;
            font-size: .85em;
            border: 1px solid #ddd;
        }
        
        .value {
            padding: 1px 6px;
            background: #444;
            color: #eee;
            font-size: .95em;
            
            &.red {
                background: indianred;
                color: white;
            }
        }
    }
`

const Actions = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    overflow-x: auto;
    user-select: none;
    
    button, a {
        flex: 1;
        flex-grow: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 6px;
        background: transparent;
        text-decoration: none;
        border: 0;
        color: #ccc;
        cursor: pointer;
        transition: .1s ease;
        
        ${media.tablet} {
            margin-right: 10px;
        }

        &:last-child {
            margin-right: 0;
        }

        &:hover {
            color: #222;
        }

        i {
            margin-bottom: 3px;
            
            ${media.tablet} {
                font-size: 1.2em;
            }
        }

        span {
            font-size: .7em;
            max-width: 66px;
            text-align: center;
        }
    }
`
