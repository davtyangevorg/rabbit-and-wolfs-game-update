import React from 'react'

import styled from 'styled-components'

import { useKeyPress } from '../hooks/use-key-press.js'
import { moveHeroes } from '../utils.js'

import Square from './square.jsx'

const GameBoard = ({ board, setNewGameBoard, boardWidth }) => {

    useKeyPress(event => {
        const direction = event.key.replace('Arrow', '').toLowerCase()
        if (direction === 'left' || direction === 'right' || direction === 'up' || direction === 'down') return setNewGameBoard(prevState => moveHeroes(direction)(prevState))
    })

    return (
        <GameBoardWrapper boardWidth={boardWidth}>
            {board.map(array => {
                return array.map((el, i) => {
                    return <Square key={i} square={el} />
                })
            })}
        </GameBoardWrapper>
    )
}

export default GameBoard

const GameBoardWrapper = styled.div`
    outline:1px solid black;
    width: ${props => props.boardWidth}px;
    display: flex;
    flex-wrap: wrap;
`