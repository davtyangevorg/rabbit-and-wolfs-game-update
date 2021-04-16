import HomeImage from './images/rabbit-home.png'
import RabbitImage from './images/rabbit.png'
import FenceImage from './images/fence.png'
import WolfImage from './images/wolf.png'

const getRandomNumber = range => Math.floor(Math.random() * range)

const getRandomCoordinate = board => {
    const x = getRandomNumber(board[0].length)
    const y = getRandomNumber(board.length)

    if (board[x][y] === null) return [x, y]
    return getRandomCoordinate(board)
}

const putHeroesInBoard = (board, hero, heroQuantity) => {
    for (let i = 1; i <= heroQuantity; i++) {
        const heroCoordinate = getRandomCoordinate(board)
        board[heroCoordinate[0]][heroCoordinate[1]] = { ...hero, y: heroCoordinate[0], x: heroCoordinate[1] }
    }
}

export const generateBoard = (n, m, wolfQuantity, fenceQuantity) => {
    const board = Array(n).fill().map(_ => Array(m).fill(null))

    putHeroesInBoard(board, { name: 'rabbit', img: RabbitImage }, 1)
    putHeroesInBoard(board, { name: 'home', img: HomeImage }, 1)
    putHeroesInBoard(board, { name: 'wolf', img: WolfImage }, wolfQuantity)
    putHeroesInBoard(board, { name: 'fence', img: FenceImage }, fenceQuantity)

    return board
}
export const moveHeroes = direction => prevState => {
    const move = (deltaX, deltaY) => moveWolf(moveRabbit(prevState, deltaX, deltaY, prevState.length, prevState[0].length), direction)

    if (direction === 'left') return move(-1, 0)
    if (direction === 'right') return move(1, 0)
    if (direction === 'up') return move(0, -1)
    if (direction === 'down') return move(0, 1)
}

const getHeroesCoordinate = (heroesName, board) => [].concat(...board).filter(el => el?.name === heroesName)
const resetElementInBoard = (heroesName, board) => board.map(row => row.map(el => el?.name === heroesName ? null : el))

const getRabbitNextStep = (rabbit, m, n, nulledBoard, deltaX, deltaY) => {
    let newY = (rabbit.y + deltaY) < 0 ? m - 1 : (rabbit.y + deltaY) === m ? 0 : rabbit.y + deltaY
    let newX = (rabbit.x + deltaX) < 0 ? n - 1 : (rabbit.x + deltaX) === n ? 0 : rabbit.x + deltaX

    nulledBoard.forEach((row, i) => row.forEach((el, j) => {
        if (i === newY && j === newX && (el?.name === 'fence' || el?.name === 'wolf')) {
            newY = rabbit.y
            newX = rabbit.x
        }
    }))
    return [newX, newY]
}

function moveRabbit(board, deltaX, deltaY, m, n) {
    
    const rabbit = getHeroesCoordinate('rabbit', board)[0]
    const nulledBoard = resetElementInBoard('rabbit', board)
    const [newX, newY] = getRabbitNextStep(rabbit, m, n, nulledBoard, deltaX, deltaY)
    return nulledBoard.map((row, i) => row.map((el, j) => (i === newY && j === newX) ? { ...rabbit, x: newX, y: newY } : el))
}

function moveWolf(board, direction) {
    const rabbit = getHeroesCoordinate('rabbit', board)[0]
    const wolfsArray = getHeroesCoordinate('wolf', board)
    let nulledBoard = resetElementInBoard('wolf', board)

    for (let i = 0; i < wolfsArray.length; i++) {

        const { newY: newWolfY, newX: newWolfX } = generateWolfNextStep(rabbit.y, rabbit.x, wolfsArray[i].y, wolfsArray[i].x, direction, nulledBoard)

        nulledBoard = nulledBoard.map((row, k) => row.map((el, j) => (k === newWolfY && j === newWolfX)
            ? { ...wolfsArray[i], x: newWolfX, y: newWolfY } : el))
    }

    return nulledBoard
}
const generateWolfNextStep = (rabbitY, rabbitX, wolfY, wolfX, direction, board) => {
    let newX = wolfX
    let newY = wolfY

    if (wolfX === rabbitX) {
        newY = wolfY > rabbitY ? wolfY - 1 : wolfY + 1
    }
    else if (wolfY === rabbitY || direction === 'left' || direction === 'right') {
        newX = wolfX < rabbitX ? wolfX + 1 : wolfX - 1
    }
    else if (direction === 'up' || direction === 'down') {
        newY = wolfY < rabbitY ? wolfY + 1 : wolfY - 1
    }

    board.forEach((row, i) => row.forEach((el, j) => {
        if (i === newY && j === newX && (el?.name === 'home' || el?.name === 'fence' || el?.name === 'wolf')) {
            newX = wolfX
            newY = wolfY
        }
    }))

    return { newY, newX }
}

export const findWinner = board => {
    const isHomeFind = board.length > 0 ? !!getHeroesCoordinate('home', board)[0] : true
    const isRabbitFind = board.length > 0 ? !!getHeroesCoordinate('rabbit', board)[0] : true

    if (!isHomeFind) return 'rabbit'
    if (!isRabbitFind) return 'wolf'
    return null
}