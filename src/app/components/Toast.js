import React from 'react'
import { ToastContainer as OriginalContainer } from 'react-toastify'
import 'react-toastify/scss/main.scss'
import './Toast.scss'

export const ToastContainer = (props) => <OriginalContainer {...props} />

const Toast = ({ text, closeToast }) => {
    const html = text.replace(/_(.*?)_/g, '<b>$1</b>')

    return <div onClick={closeToast} dangerouslySetInnerHTML={{__html: html}}></div>
}

export default Toast
