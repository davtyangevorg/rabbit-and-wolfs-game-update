import React from 'react'

import styled from 'styled-components'

import HomeImage from '../images/rabbit-home.png'
import RabbitImage from '../images/rabbit.png'
import FenceImage from '../images/fence.png'
import WolfImage from '../images/wolf.png'

const Square = ({ square }) => {

    return (
        square
            ? <HeroesImage src={getHeroesImage(square)} />
            : <SquareWrapper />
    )
}

export default Square

const getHeroesImage = heroes => {
    if (heroes === 'home') return HomeImage
    if (heroes === 'rabbit') return RabbitImage
    if (heroes === 'fence') return FenceImage
    if (heroes === 'wolf') return WolfImage
}

const SquareWrapper = styled.div`
    border:1px solid red;
    height: 80px;
    width: 80px;
`
const HeroesImage = styled.img`
    height: 80px;
    width: 80px;
`