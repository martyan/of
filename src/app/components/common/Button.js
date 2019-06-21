import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'

const Button = ({ children, loading, onClick, style }) => (
        <button className="button" onClick={onClick} style={style || {}}>
            {children}

            <span className={loading ? 'loading visible' : 'loading'}>
                <span className="double-bounce1"></span>
                <span className="double-bounce2"></span>
            </span>
        </button>
)

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    style: PropTypes.object
}

export default Button
