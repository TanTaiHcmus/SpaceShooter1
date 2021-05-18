const handleCheckImpactLeft = (a, b, xLeft, yBottom, yTop) => {
    let y = a * (xLeft - BALL_SIZE) + b;
    if (y >= yBottom && y <= yTop) return {x: xLeft - BALL_SIZE, y}

    y = a * xLeft + b
    if (y >= yBottom && y <= yTop) return {x: xLeft, y}

    return null
}

const handleCheckImpactBottom = (a, b, yBottom, xLeft, xRight) => {
    let x = (yBottom - BALL_SIZE - b) / a
    if (x >= xLeft && x <= xRight) return {x, y: yBottom - BALL_SIZE}

    x = (yBottom - b) / a
    if (x >= xLeft && x <= xRight) return {x, y: yBottom}

    return null
}

const handleCheckImpactTop = (a, b, yTop, xLeft, xRight) => {
    let x = (yTop + BALL_SIZE - b) / a
    if (x >= xLeft && x <= xRight) return {x, y: yTop + BALL_SIZE}

    x = (yTop - b) / a
    if (x >= xLeft && x <= xRight) return {x, y: yTop}

    return null
}

const handleCheckImpactRight = (a, b, xRight, yBottom, yTop) => {
    let y = a * (xRight + BALL_SIZE) + b;
    if (y >= yBottom && y <= yTop) return {x: xRight + BALL_SIZE, y}

    y = a * xRight + b
    if (y >= yBottom && y <= yTop) return {x: xRight, y}

    return null
}

const getDistance = (xA, xB, yA, yB) => {
    return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2))
}

const checkDirection = (y, prevY, direction) => {
    return ((direction === DIRECTION.UP && y > prevY) || (direction === DIRECTION.DOWN && y < prevY))
}

const handleGetImpactInfo = (state, x, y, x1, y1) => {
    const {a, direction, prevXBall, prevYBall} = state;
    const b = prevYBall - a * prevXBall;
    let result = {}

    const impactLeft = handleCheckImpactLeft(a, b, x, y, y1 )
    if (impactLeft && checkDirection(impactLeft.y, prevYBall, direction)) {
        const distanceLeft = getDistance(prevXBall, impactLeft.x, prevYBall, impactLeft.y)
        if (!result.distance || distanceLeft < result.distance){
            result = {distance: distanceLeft, direction, x: impactLeft.x, y: impactLeft.y}
        }
    }

    const impactRight = handleCheckImpactRight(a, b, x1, y, y1 )
    if (impactRight && checkDirection(impactRight.y, prevYBall, direction)) {
        const distanceRight = getDistance(prevXBall, impactRight.x, prevYBall, impactRight.y)
        if (!result.distance || distanceRight < result.distance){
            result = {distance: distanceRight, direction, x: impactRight.x, y: impactRight.y}
        }
    }

    if (direction === DIRECTION.UP){
        const impactBottom = handleCheckImpactBottom(a, b, y, x, x1 )
        if (impactBottom && checkDirection(impactBottom.y, prevYBall, direction)) {
            const distanceBottom = getDistance(prevXBall, impactBottom.x, prevYBall, impactBottom.y)
            if (!result.distance || distanceBottom < result.distance){
                result = {distance: distanceBottom, direction: DIRECTION.DOWN, x: impactBottom.x, y: impactBottom.y}
            }
        }
    }

    if (direction === DIRECTION.DOWN){
        const impactTop = handleCheckImpactTop(a, b, y1, x, x1 )
        if (impactTop && checkDirection(impactTop.y, prevYBall, direction)) {
            const distanceTop = getDistance(prevXBall, impactTop.x, prevYBall, impactTop.y)
            if (!result.distance || distanceTop < result.distance){
                result = {distance: distanceTop, direction: DIRECTION.UP, x: impactTop.x, y: impactTop.y}
            }
        }
    }

    return result;
}

const checkImpactTile = (xBall, yBall, xTile) => {
    if (xBall >= xTile - TILE_SIZE.WIDTH / 2 && xBall <= xTile + TILE_SIZE.WIDTH / 2){
        if (yBall >= TILE_SIZE.HEIGHT && yBall - TILE_SIZE.HEIGHT <= BALL_SIZE){
            cc.log("tai")
            return true
        }
    }
    else if (yBall >= 0 && yBall <= TILE_SIZE.HEIGHT){
        if ((xBall >= xTile + TILE_SIZE.WIDTH / 2 && xBall - xTile - TILE_SIZE.WIDTH / 2 <= BALL_SIZE) || (xBall <= xTile - TILE_SIZE.WIDTH / 2 && xTile - TILE_SIZE.WIDTH / 2 - xBall <= BALL_SIZE)) {
            return true
        }
    }
    return false
}