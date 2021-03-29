const randomUnique = (range, count) => {
    const nums = new Set()
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * range))
    }
    return [...nums]
}

export const generateBoard = (m, n, fenceQuantity, wolfQuantity) => {

    const herosesHorizontalIndexs = randomUnique(m, 2 + fenceQuantity + wolfQuantity)
    const herosesVerticalIndexs = randomUnique(n, 2 + fenceQuantity + wolfQuantity)

    const boardMatrix = Array(m).fill().map((_, horizontalIndex) => Array(n).fill().map((_, i) => {
        if (horizontalIndex === herosesHorizontalIndexs[0] && i === herosesVerticalIndexs[0]) return 'home'
        if (horizontalIndex === herosesHorizontalIndexs[1] && i === herosesVerticalIndexs[1]) return 'rabbit'
        for (let j = 2; j < 2 + fenceQuantity; j++) {
            if (horizontalIndex === herosesHorizontalIndexs[j] && i === herosesVerticalIndexs[j]) return 'fence'
        }
        for (let j = 2 + fenceQuantity; j < 2 + fenceQuantity + wolfQuantity; j++) {
            if (horizontalIndex === herosesHorizontalIndexs[j] && i === herosesVerticalIndexs[j]) return `wolf`
        }
        return null
    }))
    return prevState => prevState = boardMatrix
}

export const moveHeroes = direction => prevState => {

    let newState = null

    switch (direction) {
        case 'left': {
            newState = moveRabbit(prevState, 'rabbit', -1, 0, prevState.length, prevState[0].length)
            newState = moveWolf(newState, 'wolf', direction)
            break
        }
        case 'right': {
            newState = moveRabbit(prevState, 'rabbit', 1, 0, prevState.length, prevState[0].length)
            newState = moveWolf(newState, 'wolf', direction)
            break
        }
        case 'up': {
            newState = moveRabbit(prevState, 'rabbit', 0, -1, prevState.length, prevState[0].length)
            newState = moveWolf(newState, 'wolf', direction)
            break
        }
        case 'down': {
            newState = moveRabbit(prevState, 'rabbit', 0, 1, prevState.length, prevState[0].length)
            newState = moveWolf(newState, 'wolf', direction)
            break
        }
    }
    return newState
}

function moveRabbit(matrix, heroesName, deltaX, deltaY, m, n) {
    let heroesHorizontalIndex = null
    let heroesVerticalIndex = null

    const nulledMatrix = matrix.map((horizontalArray, horizontalIndex) => horizontalArray.map((el, i) => {
        if (el === heroesName) {
            heroesHorizontalIndex = horizontalIndex
            heroesVerticalIndex = i
            return null
        }
        return el
    }))
    let newHorizontalIndex = (heroesHorizontalIndex + deltaY) < 0 ? m - 1 : (heroesHorizontalIndex + deltaY) === m ? 0 : heroesHorizontalIndex + deltaY
    let newVerticalIndex = (heroesVerticalIndex + deltaX) < 0 ? n - 1 : (heroesVerticalIndex + deltaX) === n ? 0 : heroesVerticalIndex + deltaX

    nulledMatrix.forEach((horizontalArray, horizontalIndex) => horizontalArray.forEach((el, i) => {
        if (horizontalIndex === newHorizontalIndex && i === newVerticalIndex && (el === 'fence' || el === 'wolf')) {
            newHorizontalIndex = heroesHorizontalIndex
            newVerticalIndex = heroesVerticalIndex
        }
    }))

    return nulledMatrix.map((horizontalArray, horizontalIndex) => horizontalArray.map((el, i) => {
        if (horizontalIndex === newHorizontalIndex && i === newVerticalIndex) return heroesName
        return el
    }))
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

    matrix.forEach((horizontalArray, horizontalIndex) => horizontalArray.forEach((el, i) => {
        if (horizontalIndex === newY && i === newX && (el === 'home' || el === 'fence')) {
            newX = wolfX
            newY = wolfY
        }
    }))

    return { newY, newX }
}

function moveWolf(matrix, heroesName, direction) {
    let rabbitHorizontalIndex = null
    let rabbitVerticalIndex = null
    let wolfHorizontalIndex = []
    let wolfVerticalIndex = []
    let nulledMatrix = matrix.map((horizontalArray, horizontalIndex) => horizontalArray.map((el, i) => {
        if (el === heroesName) {
            wolfHorizontalIndex.push(horizontalIndex)
            wolfVerticalIndex.push(i)
            return null
        }
        if (el === 'rabbit') {
            rabbitHorizontalIndex = horizontalIndex
            rabbitVerticalIndex = i
        }
        return el
    }))

    for (let i = 0; i < wolfHorizontalIndex.length; i++) {

        const { newY: wolfNewHorizontalIndex, newX: wolfNewVerticalIndex } = generateWolfNextStep(rabbitHorizontalIndex, rabbitVerticalIndex, wolfHorizontalIndex[i], wolfVerticalIndex[i], direction, nulledMatrix)

        nulledMatrix = nulledMatrix.map((horizontalArray, horizontalIndex) => horizontalArray.map((el, j) => {
            if (horizontalIndex === wolfNewHorizontalIndex && j === wolfNewVerticalIndex) return heroesName
            return el
        }))
    }


    return nulledMatrix
}

export const findWinner = matrix => {
    const isHomeFind = matrix.length > 0 ? [].concat(...matrix).indexOf('home') !== -1 : true
    const isRabbitFind = matrix.length > 0 ? [].concat(...matrix).indexOf('rabbit') !== -1 : true

    if (!isHomeFind) return 'rabbit'
    if (!isRabbitFind) return 'wolf'
    return null
}