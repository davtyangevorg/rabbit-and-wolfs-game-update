import HomeImage from './images/rabbit-home.png'
import RabbitImage from './images/rabbit.png'
import FenceImage from './images/fence.png'
import WolfImage from './images/wolf.png'

export const generateBoard = (n, m, fenceQuantity, wolfQuantity) => {
    const board = fillBoardInNumbers(n, m)
    const randomNumbers = createRandomNumbers(n * m, 2 + fenceQuantity + wolfQuantity)

    const put = (board, q, name, img) => putHeroesInBoard(board, randomNumbers.splice(0, q), name, img, q)
    const newBoard = put(put(put(put(board, 1, 'home', HomeImage), 1, 'rabbit', RabbitImage), fenceQuantity, 'fence', FenceImage), wolfQuantity, 'wolf', WolfImage)

    return nulledBoard(newBoard)
}
const fillBoardInNumbers = (n, m) => {
    let number = 0
    const board = Array(n).fill().map(_ => Array(m).fill().map(el => {
        number++
        return number
    }))
    return board
}
const createRandomNumbers = (range, count) => {
    const nums = new Set()
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range))
    }
    return [...nums]
}
const putHeroesInBoard = (board, number, heroesName, heroesImg, hereosQuantity) => {
    let newBoard = [...board]
    for (let k = 0; k < hereosQuantity; k++) {
        board.forEach((row, i) => row.map((el, j) => {
            if (el === number[k]) newBoard[i][j] = ({ name: heroesName, img: heroesImg, x: i, y: j })
        }))
    }
    return newBoard
}
const nulledBoard = board => board.map(row => row.map(el => typeof el === 'number' ? null : el))

export const moveHeroes = direction => prevState => {
    const move = (a, b) => moveWolf(moveRabbit(prevState, a, b, prevState.length, prevState[0].length), direction)

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