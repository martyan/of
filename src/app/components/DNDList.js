import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Check from './common/Check'

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    boxShadow: isDragging ? '0 0 10px 10px rgba(222,222,222, .8)' : 'none',
    background: 'white',
    border: '1px solid #eee',
    ...draggableStyle
})

const getListStyle = isDraggingOver => ({
    padding: grid,
    width: '100%'
})

class DNDList extends Component {

    static propTypes = {
        onEdit: PropTypes.func.isRequired,
        onManageImgs: PropTypes.func.isRequired
    }

    state = {
        items: [],
        reorder: false
    }

    componentDidMount() {
        const { items } = this.props

        this.setState({items})
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
        const { onEdit, onManageImgs } = this.props
        const { items, reorder } = this.state

        return (
            <div>
                <Label>
                    <Check onChange={() => this.setState({reorder: !reorder})} checked={reorder} />
                    <span>Reorder products</span>
                </Label>

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
                                            <Item
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <Photo />
                                                <Description>
                                                    <div className="name">{item.name}</div>
                                                    <div className="category">
                                                        {item.gender === 'men' && <i className="fa fa-mars"></i>}
                                                        {item.gender === 'women' && <i className="fa fa-venus"></i>}
                                                        {item.gender === 'uni' && <i>UNI</i>}
                                                        <span>{item.category}</span>
                                                    </div>
                                                    <div className="description">{item.description}</div>
                                                    <div className="price">CZK {item.price}</div>
                                                    {!reorder && (
                                                        <div className="actions">
                                                            <button onClick={() => onEdit(item.id)}>Edit product</button>
                                                            <button onClick={() => onManageImgs(item.id)}>Manage images</button>
                                                        </div>
                                                    )}
                                                </Description>
                                                {reorder && <Handle><i className="fa fa-arrows-v"></i></Handle>}
                                            </Item>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

        )
    }
}

export default DNDList


const Item = styled.div`
    display: flex;
    position: relative;
`

const Photo = styled.div`
    flex-basis: 70px;
    height: 80px;
    margin-right: 15px;
`

const Description = styled.div`
    flex: 1;
    
    .name {
        font-family: 'Roboto Slab', serif;
        font-size: 1.1em;
        font-weight: 500;
        margin-bottom: 5px;
    }
    
    .category {
        margin-bottom: 5px;
        font-weight: 300;
    
        i {
            margin-right: 5px;
            font-weight: 500;
        }
    }
    
    .description {
        font-size: .8em;
    }
    
    .price {
        font-family: 'Roboto Slab', serif;
        font-weight: 500;
        margin-bottom: 5px;
    }
    
    .actions {
        display: flex;
        
        button {
            flex: 1;
            flex-basis: 100px;
            flex-shrink: 0;
            flex-grow: 0;
            font-size: .8em;
            background: #444;
            color: white;
            border: 0;
            margin: 5px;
            padding: 5px;
            border-radius: 3px;
            
            &:first-child {
                margin-left: 0;
            }
            
            &:last-child {
                margin-right: 0;
            }
        }
    }
`

const Handle = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    color: #ccc;
    font-size: 1.1em;
`

const Label = styled.label`
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
`
