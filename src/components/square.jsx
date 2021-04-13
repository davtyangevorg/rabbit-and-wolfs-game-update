import React from 'react'

import styled from 'styled-components'

const Square = ({ square }) => {
    return (
        square
            ? <HeroesImage src={square.img} />
            : <SquareWrapper />
    )
}

export default Square

const SquareWrapper = styled.div`
    height: 80px;
    width: 80px;
`
const HeroesImage = styled.img`
    height: 80px;
    width: 80px;
`