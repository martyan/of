import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateProduct, getProducts } from '../../lib/shop/actions'
import styled from 'styled-components'
import Modal from '../common/Modal'
import ImgUpload from '../admin/ImgUpload'
import Button from '../common/Button'


const ImgMGMT = ({ product, close, updateProduct, getProducts }) => {
    const [items, setItems] = useState([])
    const [reorder, setReorder] = useState(false)
    const [uploadVisible, setUploadVisible] = useState(false)

    useEffect(() => {
        setItems(product.photos)
    })

    const updateProductPhotos = (photos) => {
        const data = {
            photos: [...product.photos, ...photos]
        }

        updateProduct(product.id, data)
            .then(getProducts)
            .then(() => setUploadVisible(false))
            .catch(console.error)
    }

    return (
        <div>
            <Wrapper>
                <h1>Photo management</h1>

                <Button onClick={() => setUploadVisible(true)}>Upload img</Button>

                <Photos>
                    {items.map((item, index) => (
                        <div key={index} className="photo">
                            {!reorder && <button className="delete"><i className="fa fa-trash"></i></button>}
                            <button className="reorder" onClick={() => setReorder(!reorder)}><i className="fa fa-arrows-v"></i></button>
                            <img src={item} />
                        </div>
                    ))}
                </Photos>

                <Button style={{margin: '30px 0 0 0'}}>Save</Button>
            </Wrapper>

            <Modal visible={uploadVisible} onClose={() => setUploadVisible(true)}>
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
    flex-wrap: wrap;
    width: 100%;
    opacity: .8;
    
    .photo {
        flex-basis: calc((100% / 3) - 10px);
        flex-shrink: 0;
        flex-grow: 0;
        margin: 5px;
        position: relative;
    
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
    }
`
