import HomeImage from './images/rabbit-home.png'
import RabbitImage from './images/rabbit.png'
import FenceImage from './images/fence.png'
import WolfImage from './images/wolf.png'

const heroes = [
    { name: 'home', img: HomeImage },
    { name: 'rabbit', img: RabbitImage },
    { name: 'wolf', img: WolfImage },
    { name: 'fence', img: FenceImage }
]
const getHeroData = (heroName, data) => data.find(hero => hero.name === heroName)
const getRandomNumber = range => Math.floor(Math.random() * range)

const getRandomCoordinates = board => {
    const x = getRandomNumber(board[0].length)
    const y = getRandomNumber(board.length)

    if (board[y][x] === null) return [x, y]
    return getRandomCoordinates(board)
}

const putHeroInBoard = (board, hero, heroQuantity) => {
    for (let i = 1; i <= heroQuantity; i++) {
        const [x, y] = getRandomCoordinates(board)
        board[y][x] = hero
    }
}
export const generateBoard = (n, m, wolfQuantity, fenceQuantity) => {
    const board = Array(n).fill().map(_ => Array(m).fill(null))

    putHeroInBoard(board, getHeroData('rabbit', heroes), 1)
    putHeroInBoard(board, getHeroData('home', heroes), 1)
    putHeroInBoard(board, getHeroData('wolf', heroes), wolfQuantity)
    putHeroInBoard(board, getHeroData('fence', heroes), fenceQuantity)

    return board
}
const isStepAllowed = (board, exception, x, y) => (board[y][x] === null || board[y][x]?.name === exception) ? true : false
const getHeroCoordinates = (heroesName, board) => {
    const coordinates = []
    board.forEach((row, i) => row.forEach((el, j) => {
        if (el?.name === heroesName) coordinates.push([i, j])
    }))
    return coordinates
}
const getRabbitNextStep = (x, y, board, deltaSteps) => {
    const [deltaX, deltaY] = deltaSteps
    const [n, m] = [board.length, board[0].length]
    const newY = (y + deltaY) < 0 ? n - 1 : (y + deltaY) === n ? 0 : y + deltaY
    const newX = (x + deltaX) < 0 ? m - 1 : (x + deltaX) === m ? 0 : x + deltaX
    if (isStepAllowed(board, 'home', newX, newY)) return [newX, newY]
    return [x, y]
}
function moveRabbit(board, deltaSteps) {
    const [y, x] = getHeroCoordinates('rabbit', board).flat()
    board[y][x] = null
    const [newX, newY] = getRabbitNextStep(x, y, board, deltaSteps)
    board[newY][newX] = getHeroData('rabbit', heroes)
    return board
}
export const moveHeroes = direction => board => {
    let copyBoard = [...board]
    const move = (deltaX, deltaY) => moveRabbit(copyBoard, [deltaX, deltaY])
    if (direction === 'left') copyBoard = move(-1, 0)
    if (direction === 'right') copyBoard = move(1, 0)
    if (direction === 'up') copyBoard = move(0, -1)
    if (direction === 'down') copyBoard = move(0, 1)
    return moveWolf(copyBoard)
}

const getAllPossibleCoordinates = (wolfCoordinates, board) => {
    const [y, x] = wolfCoordinates
    const coordinates = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]]
    return coordinates.filter(([y, x]) => !(y < 0 || x < 0 || y === board.length || x === board[0].length))
}
const getAllFreeCoordinates = (coordinates, board) => coordinates.filter(([y, x]) => isStepAllowed(board, 'rabbit', x, y))
const findDistance = (wCoord, rCoord) => Math.sqrt(Math.pow(wCoord[0] - rCoord[0], 2) + Math.pow(wCoord[1] - rCoord[1], 2))
const getRequiredCoordinates = (coordinates, rabbitCoordinates) => {
    const distances = []
    for (let i = 0; i < coordinates.length; i++) {
        distances.push(findDistance(coordinates[i], rabbitCoordinates))
    }
    return coordinates.find((_, i) => i === distances.indexOf(Math.min(...distances)))
}
const getWolfNextStep = (board, wolfCoordinates, rabbitCoordinates) => {
    const allPossibleCoordinates = getAllPossibleCoordinates(wolfCoordinates, board)
    const allFreeCoordinates = getAllFreeCoordinates(allPossibleCoordinates, board)
    return allFreeCoordinates.length === 0 ? wolfCoordinates : getRequiredCoordinates(allFreeCoordinates, rabbitCoordinates)
}
function moveWolf(board) {
    const rabbitCoordinates = getHeroCoordinates('rabbit', board).flat()
    const wolfsCoordinates = getHeroCoordinates('wolf', board)
    for (let i = 0; i < wolfsCoordinates.length; i++) {
        board[wolfsCoordinates[i][0]][wolfsCoordinates[i][1]] = null
        const [newY, newX] = getWolfNextStep(board, wolfsCoordinates[i], rabbitCoordinates)
        board[newY][newX] = getHeroData('wolf', heroes)
    }
    return board
}
export const findWinner = board => {
    const isHomeFind = board.length > 0 ? !!getHeroCoordinates('home', board)[0] : true
    const isRabbitFind = board.length > 0 ? !!getHeroCoordinates('rabbit', board)[0] : true

    if (!isHomeFind) return 'rabbit'
    if (!isRabbitFind) return 'wolf'
    return null
}