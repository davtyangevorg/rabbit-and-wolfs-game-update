import React, { useState, useEffect, useLayoutEffect } from 'react'

import styled, { createGlobalStyle } from 'styled-components'

import { generateBoard, findWinner } from './utils.js'

import BoardSizeDropDown from './components/dropDown.jsx'
import GameBoard from './components/gameBoard.jsx'

const boardSizeOptions = [
    { _id: 1, value: { x: 10, y: 10 } },
    { _id: 2, value: { x: 7, y: 7 } },
    { _id: 3, value: { x: 5, y: 5 } }
]
const IMAGE_HEIGTH = 80

const App = () => {

    const [boardSize, setBoardSize] = useState(boardSizeOptions[0].value)
    const [board, setNewGameBoard] = useState([])
    const [whoWin, setWhoWin] = useState(null)

    const fenceQuantity = Math.floor((boardSize.x + boardSize.y) * 0.3)
    const wolfQuantity = Math.floor((boardSize.x + boardSize.y) * 0.3)

    const [rabbitWinCount, setRabbitWinCount] = useState(0)
    const [wolfsWinCount, setWolfsWinCount] = useState(0)

    useLayoutEffect(() => {
        setWhoWin(() => findWinner(board))
    }, [board])

    useEffect(() => {
        if (whoWin) {
            alert(`winner is a ${whoWin}`)
            if (whoWin === 'rabbit') setRabbitWinCount(prevState => prevState + 1)
            if (whoWin === 'wolf') setWolfsWinCount(prevState => prevState + 1)
            setWhoWin(null)
            setNewGameBoard([])
        }
    }, [whoWin])

    return (
        <div >
            <Tools>
                <BoardSizeDropDown
                    options={boardSizeOptions}
                    setBoardSize={setBoardSize}
                />
                <StartGameButton
                    onClick={() => setNewGameBoard(generateBoard(boardSize.x, boardSize.y, fenceQuantity, wolfQuantity))}
                >
                    Start Game
                </StartGameButton>
                <GameScore>Rabbit : {rabbitWinCount}</GameScore>
                <GameScore>Wolfs : {wolfsWinCount}</GameScore>
            </Tools>
            <GameBoardWrapper>
                {board.length > 0 && <GameBoard
                    board={board}
                    setNewGameBoard={setNewGameBoard}
                    boardWidth={boardSize.x * IMAGE_HEIGTH}
                />}
            </GameBoardWrapper>
            <GlobalStyle />
        </div>
    )
}

export default App



const GlobalStyle = createGlobalStyle`
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: 'Montserrat', sans-serif;
    }
    body{
        background-color: #A8CF45;
    }
`

const Tools = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid black;
    height: 5vh;
`
const StartGameButton = styled.button`
    outline: none;
    cursor: pointer;
    background-color: #FF9A3E;
    padding: 10px;
    border: 0;
    border-radius: 5px;
    color: white;
    transition: all .1s;
    &:hover{
        background-color: #FF823E;
    }
`
const GameBoardWrapper = styled.div`
    display: grid;
    place-content: center;
    height: 95vh;
`
const GameScore = styled.span`
    margin-left: 20px;
    margin-right: 20px;
`