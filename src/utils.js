import HomeImage from './images/rabbit-home.png'
import RabbitImage from './images/rabbit.png'
import FenceImage from './images/fence.png'
import WolfImage from './images/wolf.png'

const randomUnique = (range, count) => {
    const nums = new Set()
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range))
    }
    return [...nums]
}

export const generateBoard = (m, n, fenceQuantity, wolfQuantity) => {

    const herosesY = randomUnique(m, 2 + fenceQuantity + wolfQuantity)
    const herosesX = randomUnique(n, 2 + fenceQuantity + wolfQuantity)

    const boardMatrix = Array(m).fill().map((_, horizontalIndex) => Array(n).fill().map((_, i) => {
        if (horizontalIndex === herosesY[0] && i === herosesX[0]) return { name: 'home', img: HomeImage }
        if (horizontalIndex === herosesY[1] && i === herosesX[1]) return { name: 'rabbit', img: RabbitImage, x: i, y: horizontalIndex }
        for (let j = 2; j < 2 + fenceQuantity; j++) {
            if (horizontalIndex === herosesY[j] && i === herosesX[j]) return { name: 'fence', img: FenceImage }
        }
        for (let j = 2 + fenceQuantity; j < 2 + fenceQuantity + wolfQuantity; j++) {
            if (horizontalIndex === herosesY[j] && i === herosesX[j]) return { name: 'wolf', img: WolfImage, x: i, y: horizontalIndex }
        }
        return null
    }))
    return boardMatrix
}

export const moveHeroes = direction => prevState => {

    switch (direction) {
        case 'left': {
            return moveWolf(moveRabbit(prevState, 'rabbit', -1, 0, prevState.length, prevState[0].length), 'wolf', direction)
        }
        case 'right': {
            return moveWolf(moveRabbit(prevState, 'rabbit', 1, 0, prevState.length, prevState[0].length), 'wolf', direction)
        }
        case 'up': {
            return moveWolf(moveRabbit(prevState, 'rabbit', 0, -1, prevState.length, prevState[0].length), 'wolf', direction)
        }
        case 'down': {
            return moveWolf(moveRabbit(prevState, 'rabbit', 0, 1, prevState.length, prevState[0].length), 'wolf', direction)
        }
    }
}

function moveRabbit(matrix, heroesName, deltaX, deltaY, m, n) {

    let heroes = null

    const nulledMatrix = matrix.map(row => row.map(el => {
        if (el?.name === heroesName) {
            heroes = el
            return null
        }
        return el
    }))

    let newY = (heroes.y + deltaY) < 0 ? m - 1 : (heroes.y + deltaY) === m ? 0 : heroes.y + deltaY
    let newX = (heroes.x + deltaX) < 0 ? n - 1 : (heroes.x + deltaX) === n ? 0 : heroes.x + deltaX

    nulledMatrix.forEach((row, i) => row.forEach((el, j) => {
        if (i === newY && j === newX && (el?.name === 'fence' || el?.name === 'wolf')) {
            newY = heroes.y
            newX = heroes.x
        }
    }))

    return nulledMatrix.map((row, i) => row.map((el, j) => {
        if (i === newY && j === newX) return { ...heroes, x: newX, y: newY }
        return el
    }))
}

function moveWolf(matrix, heroesName, direction) {
    let rabbit = null
    let wolfsArray = []

    let nulledMatrix = matrix.map(row => row.map(el => {
        if (el?.name === heroesName) {
            wolfsArray.push(el)
            return null
        }
        if (el?.name === 'rabbit') {
            rabbit = el
        }
        return el
    }))
    for (let i = 0; i < wolfsArray.length; i++) {

        const { newY: newWolfY, newX: newWolfX } = generateWolfNextStep(rabbit.y, rabbit.x, wolfsArray[i].y, wolfsArray[i].x, direction, nulledMatrix)

        nulledMatrix = nulledMatrix.map((row, horizontalIndex) => row.map((el, j) => {
            if (horizontalIndex === newWolfY && j === newWolfX) return { ...wolfsArray[i], x: newWolfX, y: newWolfY }
            return el
        }))
    }


    return nulledMatrix
}
const generateWolfNextStep = (rabbitY, rabbitX, wolfY, wolfX, direction, matrix) => {
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

    matrix.forEach((row, i) => row.forEach((el, j) => {
        if (i === newY && j === newX && (el?.name === 'home' || el?.name === 'fence' || el?.name === 'wolf')) {
            newX = wolfX
            newY = wolfY
        }
    }))

    return { newY, newX }
}

export const findWinner = matrix => {
    const isHomeFind = matrix.length > 0 ? [].concat(...matrix).findIndex(el => el?.name === 'home') !== -1 : true
    const isRabbitFind = matrix.length > 0 ? [].concat(...matrix).findIndex(el => el?.name === 'rabbit') !== -1 : true

    if (!isHomeFind) return 'rabbit'
    if (!isRabbitFind) return 'wolf'
    return null
}