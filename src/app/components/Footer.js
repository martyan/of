import React from 'react'
import styled from 'styled-components'
import { media } from './common/variables'

const Footer = () => {
    return (
        <Wrapper>
            <Inner>
                <Language>English (EUR)</Language>
                &middot;
                <Copyright><Brand>Old Felony</Brand> 2019</Copyright>
            </Inner>
        </Wrapper>
    )
}

export default Footer


const Wrapper = styled.footer`
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 15px 20px;
    background: #222;
    color: #aaa;
`

const Inner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px;
    margin: 0 auto;

    ${media.tablet} {
        justify-content: flex-end;
    }
`

const Language = styled.div`
    font-size: .9em;
    font-weight: 300;
    margin-right: 10px;
`

const Copyright = styled.div`
    font-size: .9em;
    margin-left: 10px;
`

const Brand = styled.span`
    margin-right: 10px;
    font-size: 1.2em;
    font-family: 'Pacifico', cursive;
    color: #ddd;
`
