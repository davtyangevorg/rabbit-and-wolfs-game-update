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
        if (horizontalIndex === herosesY[0] && i === herosesX[0]) return 'home'
        if (horizontalIndex === herosesY[1] && i === herosesX[1]) return 'rabbit'
        for (let j = 2; j < 2 + fenceQuantity; j++) {
            if (horizontalIndex === herosesY[j] && i === herosesX[j]) return 'fence'
        }
        for (let j = 2 + fenceQuantity; j < 2 + fenceQuantity + wolfQuantity; j++) {
            if (horizontalIndex === herosesY[j] && i === herosesX[j]) return `wolf`
        }
        return null
    }))
    return prevState => prevState = boardMatrix
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
    let y = null
    let x = null

    const nulledMatrix = matrix.map((row, i) => row.map((el, j) => {
        if (el === heroesName) {
            y = i
            x = j
            return null
        }
        return el
    }))
    let newY = (y + deltaY) < 0 ? m - 1 : (y + deltaY) === m ? 0 : y + deltaY
    let newX = (x + deltaX) < 0 ? n - 1 : (x + deltaX) === n ? 0 : x + deltaX

    nulledMatrix.forEach((row, i) => row.forEach((el, j) => {
        if (i === newY && j === newX && (el === 'fence' || el === 'wolf')) {
            newY = y
            newX = x
        }
    }))

    return nulledMatrix.map((row, i) => row.map((el, j) => {
        if (i === newY && j === newX) return heroesName
        return el
    }))
}

function moveWolf(matrix, heroesName, direction) {
    let rabbitY = null
    let rabbitX = null
    let wolfY = []
    let wolfX = []
    let nulledMatrix = matrix.map((row, i) => row.map((el, j) => {
        if (el === heroesName) {
            wolfY.push(i)
            wolfX.push(j)
            return null
        }
        if (el === 'rabbit') {
            rabbitY = i
            rabbitX = j
        }
        return el
    }))

    for (let i = 0; i < wolfY.length; i++) {

        const { newY: newWolfY, newX: newWolfX } = generateWolfNextStep(rabbitY, rabbitX, wolfY[i], wolfX[i], direction, nulledMatrix)

        nulledMatrix = nulledMatrix.map((row, horizontalIndex) => row.map((el, j) => {
            if (horizontalIndex === newWolfY && j === newWolfX) return heroesName
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
        if (i === newY && j === newX && (el === 'home' || el === 'fence')) {
            newX = wolfX
            newY = wolfY
        }
    }))

    return { newY, newX }
}

export const findWinner = matrix => {
    const isHomeFind = matrix.length > 0 ? [].concat(...matrix).indexOf('home') !== -1 : true
    const isRabbitFind = matrix.length > 0 ? [].concat(...matrix).indexOf('rabbit') !== -1 : true

    if (!isHomeFind) return 'rabbit'
    if (!isRabbitFind) return 'wolf'
    return null
}