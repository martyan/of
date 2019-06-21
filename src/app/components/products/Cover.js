import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Cover.scss'

class Cover extends Component {

    static propTypes = {
        img: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        start: PropTypes.number.isRequired,
        link: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired
    }

    state = {
        scrollTop: 0
    }

    componentWillMount = () => {
        try {
            window.addEventListener('scroll', this.handleScroll)
        } catch(error) {}
    }

    componentWillUnmount = () => {
        try {
            window.removeEventListener('scroll', this.handleScroll)
        } catch(error) {}
    }

    handleScroll = (event) => {
        try {
            if(window.scrollY < 500 && window.innerWidth >= 600) this.setState({scrollTop: window.scrollY})
        } catch(error) {}
    }

    render = () => {
        const { img, start, children, link, location } = this.props
        const { scrollTop } = this.state

        const position = `${start + (scrollTop / 20)}%`
        return (
            <div className="cover">
                <div className="inner" style={{backgroundImage: `url(${img})`, backgroundPositionY: position}}></div>
                <div className="caption">{children}</div>
                <div className="location">
                    <a href={link} target="_blank"><i className="fa fa-map-marker"></i> {location}</a>
                </div>
            </div>
        )
    }

}

export default Cover
