const MOVE_CLAMP = 6

export function calcDelta(oldPos, newPos) {
  let y = newPos.y - oldPos.y
  let x = newPos.x - oldPos.x
  x = clamp(x, -MOVE_CLAMP, MOVE_CLAMP)
  y = clamp(y, -MOVE_CLAMP, MOVE_CLAMP)

  // Update old pos
  oldPos.y = newPos.y
  oldPos.x = newPos.x
  return { x, y }
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
