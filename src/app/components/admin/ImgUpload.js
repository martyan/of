import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { bindActionCreators } from 'redux'
import { uploadFile } from '../../lib/auth/actions'
import Button from '../common/Button'
import styled from 'styled-components'

const ImgUpload = ({ user, uploadFile, onCompleted, path, autoPopup }) => {
    const [ serverError, setServerError ] = useState('')
    const [ loading, setLoading ] = useState(false)

    const { acceptedFiles, rejectedFiles, getRootProps, getInputProps, rootRef } = useDropzone({
        accept: 'image/jpeg, image/png',
        maxSize: 5 * 1024 * 1024
    })

    useEffect(() => {
        if(autoPopup) rootRef.current.click()
    }, [])

    const getUploadPromise = (file, index) => {
        const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
        const time = new Date().getTime()
        const name = `${time}_${index}.${ext}`
        const pathname = `${path}/${name}`

        return uploadFile(file, name, pathname)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(acceptedFiles.length === 0) return

        setLoading(true)

        const fileUploads = acceptedFiles.map((file, index) => getUploadPromise(file, index))

        Promise.all(fileUploads)
            .then(snapshots => {
                setLoading(false)

                const links = snapshots.map(snapshot => snapshot.ref.getDownloadURL())

                Promise.all(links)
                    .then(onCompleted)
                    .catch(console.error)

            })
            .catch(error => {
                setLoading(false)
                setServerError(error.code)
            })
    }

    return (
        <Wrapper>
            <h1>Upload file</h1>

            <form {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone">
                    {acceptedFiles.length === 0 ?
                        <p>Click here or drop a file to upload</p> :
                        <ul>{acceptedFiles.map(file => <li key={file.path}>{file.path} ({Math.round((file.size / 1024 / 1024) * 100) / 100} MB)</li>)}</ul>
                    }
                </div>
            </form>

            <div>{serverError}</div>

            {acceptedFiles.length > 0 && <Button loading={loading} onClick={handleSubmit} style={{marginBottom: 0}}>Upload</Button>}
        </Wrapper>
    )
}

ImgUpload.propTypes = {
    onCompleted: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
    user: state.auth.user
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        uploadFile
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(ImgUpload)


const Wrapper = styled.div`
    h1 {
        font-family: 'Roboto Slab', serif;
        font-size: 1.25em;
        font-weight: 500;
        margin: 10px 0 30px;
        text-align: center;
        color: #222;
    }
    
    .dropzone {
        margin-bottom: 30px;
        padding: 30px 15px;
        border: 1px dashed #ddd;
        cursor: pointer;
        overflow: hidden;
        
        p {
            text-align: center;
            color: #444;
        }
        
        ul {
            margin: 0;
            padding: 15px;
            list-style-type: none;
            text-align: left;
            
            li {
                display: block;
                color: #444;
                margin-bottom: 10px;
                font-size: .9em;
                color: #888;
            }
        }
    }
   
`
