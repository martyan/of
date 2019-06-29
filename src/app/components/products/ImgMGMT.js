import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateProduct, getProducts } from '../../lib/shop/actions'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { media } from '../common/variables'
import Modal from '../common/Modal'
import ImgUpload from '../admin/ImgUpload'
import Button from '../common/Button'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    margin: `0 0 ${grid}px 0`,
    boxShadow: isDragging ? '0 0 5px 5px rgba(222,222,222, .3)' : 'none',
    background: 'white',
    ...draggableStyle
})

class ImgMGMT extends Component {

    static propTypes = {
        product: PropTypes.object.isRequired,
        close: PropTypes.func.isRequired
    }

    state = {
        items: [],
        reorder: false,
        imgUploadVisible: false
    }

    componentDidMount() {
        const { product } = this.props

        this.setState({items: product.photos})
    }

    componentDidUpdate(prevProps) {
        const { product } = this.props

        if(prevProps.product !== product) this.setState({items: product.photos})
    }

    onDragEnd = (result) => {
        if(!result.destination) return

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        )

        this.setState({items})
    }

    updateProductPhotos = (photos) => {
        const { updateProduct, getProducts, product } = this.props

        const data = {
            photos: [...product.photos, ...photos]
        }

        updateProduct(product.id, data)
            .then(getProducts)
            .then(() => this.setState({imgUploadVisible: false}))
            .catch(console.error)
    }

    render() {
        const { product } = this.props
        const { items, reorder, imgUploadVisible } = this.state

        return (
            <div>
                <Wrapper>
                    <h1>Photo management</h1>

                    <Button onClick={() => this.setState({imgUploadVisible: true})}>Upload img</Button>

                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {items.map((item, index) => (
                                        <Draggable key={item} draggableId={item} index={index} isDragDisabled={!reorder}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <Photo className="photo">
                                                        {!reorder && <button className="delete"><i className="fa fa-trash"></i></button>}
                                                        <button className="reorder" onClick={() => this.setState({reorder: !reorder})}><i className="fa fa-arrows-v"></i></button>
                                                        <img src={item} />
                                                    </Photo>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Button style={{margin: '30px 0 0 0'}}>Save</Button>
                </Wrapper>

                <Modal visible={imgUploadVisible} onClose={() => this.setState({imgUploadVisible: false})}>
                    <ImgUpload
                        path={`products/${product.id}`}
                        onCompleted={this.updateProductPhotos}
                    />
                </Modal>
            </div>
        )
    }
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

const Photo = styled.div`
    position: relative;
    opacity: .8;
    
    .reorder {
        right: 0;
    }
    
    .delete {
        right: 41px;
    }
    
    .reorder, .delete {
        position: absolute;
        top: 0;
        width: 40px;
        height: 40px;
        line-height: 40px;
        background: #222;
        color: white;
        text-align: center;
        font-size: 1.1em;
        border: 0;
        cursor: pointer;
        transition: .1s ease;
        
        &:hover {
            background: #000;
        }
    }
    
    img {
        display: block;
        width: 100%;
    }
`
