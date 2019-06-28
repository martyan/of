import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { media } from './common/variables'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '15px',
    margin: `0 0 ${grid}px 0`,
    boxShadow: isDragging ? '0 0 5px 5px rgba(222,222,222, .3)' : 'none',
    background: 'white',
    border: '1px solid #eee',
    ...draggableStyle
})

const getListStyle = isDraggingOver => ({
    width: '100%'
})

class DNDList extends Component {

    static propTypes = {
        onEdit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        onManageImgs: PropTypes.func.isRequired,
        onStock: PropTypes.func.isRequired
    }

    state = {
        items: [],
        reorder: false
    }

    componentDidMount() {
        const { items } = this.props

        this.setState({items})
    }

    componentDidUpdate(prevProps) {
        const { items } = this.props

        if(prevProps.items !== items) this.setState({items})
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

    render() {
        const { onEdit, onDelete, onManageImgs, onStock } = this.props
        const { items, reorder } = this.state

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!reorder}>
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
                                                <Photos>
                                                   {item.photos.map((photo, i) => <div key={i} className="photo"><img src={photo} /></div>)}
                                                </Photos>
                                            )}

                                            <Actions className="actions">
                                                {reorder ?
                                                    <button onClick={() => this.setState({reorder: !reorder})}>
                                                        <i className="fa fa-arrows-v"></i>
                                                        <span>Done</span>
                                                    </button> :
                                                    <>
                                                        <button onClick={() => onDetail(item.id)}>
                                                            <i className="fa fa-external-link"></i>
                                                            <span>View</span>
                                                        </button>
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
                                                        <button onClick={() => this.setState({reorder: !reorder})}>
                                                            <i className="fa fa-arrows-v"></i>
                                                            <span>Reorder</span>
                                                        </button>
                                                    </>
                                                }
                                            </Actions>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

export default DNDList


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

const Label = styled.label`
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
`

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    button {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
        background: transparent;
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
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 20px;

    .photo {

        opacity: .6;

        img {
            height: 100px;
        }

    }
`
