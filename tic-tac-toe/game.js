// This game already runs: a canvas, an animation loop, keyboard and pointer
// input, and one thing moving on screen. Grow it by replacing a whole section
// between the "// === name ===" markers rather than rewriting the file.

// === config ===
const CONFIG = {
  background: '#0b1020',
  accent: '#4f8cff',
  accent2: '#ff6b6b',
  playerSpeed: 420,
  gridSize: 3,
  cellSize: 80,
  gap: 12,
  boardPadding: 40,
}

const TICTAC = {
  mode: 'pvp', // 'pvp' | 'pve'
  currentPlayer: 'X',
  board: Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(null)),
  winner: null,
  gameOver: false,
}

// === state ===
const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const game = {
  phase: 'playing',
  score: 0,
  time: 0,
  player: { x: 0, y: 0, radius: 16 },
  entities: [],
  tictactoe: {
    board: Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(null)),
    currentPlayer: 'X',
    winner: null,
    gameOver: false,
    lastMove: null,
  },
}

function resize() {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}

function reset() {
  game.phase = 'playing'
  game.score = 0
  game.time = 0
  game.entities = []
  game.player.x = canvas.width / 2
  game.player.y = canvas.height / 2
  resetTicTacToe()
}

function resetTicTacToe() {
  TICTAC.board = Array(CONFIG.gridSize).fill(null).map(() => Array(CONFIG.gridSize).fill(null))
  TICTAC.currentPlayer = 'X'
  TICTAC.winner = null
  TICTAC.gameOver = false
  TICTAC.lastMove = null
  game.tictactoe = { ...TICTAC }
}

function resize() {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
}

function reset() {
  game.phase = 'playing'
  game.score = 0
  game.time = 0
  game.entities = []
  game.player.x = canvas.width / 2
  game.player.y = canvas.height / 2
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getCell(x, y) {
  const boardX = x - CONFIG.boardPadding
  const boardY = y - CONFIG.boardPadding
  const col = Math.round((boardX / (CONFIG.cellSize + CONFIG.gap)) * (CONFIG.gridSize - 1))
  const row = Math.round((boardY / (CONFIG.cellSize + CONFIG.gap)) * (CONFIG.gridSize - 1))
  if (col >= 0 && col < CONFIG.gridSize && row >= 0 && row < CONFIG.gridSize) {
    return { row, col }
  }
  return null
}

function checkWin(board) {
  // Check rows
  for (let i = 0; i < CONFIG.gridSize; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return { winner: board[i][0], line: 'row', index: i }
    }
  }
  // Check columns
  for (let i = 0; i < CONFIG.gridSize; i++) {
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      return { winner: board[0][i], line: 'col', index: i }
    }
  }
  // Check diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return { winner: board[0][0], line: 'diag', index: 0 }
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return { winner: board[0][2], line: 'diag', index: 1 }
  }
  return null
}

function makeRandomMove() {
  const available = []
  for (let r = 0; r < CONFIG.gridSize; r++) {
    for (let c = 0; c < CONFIG.gridSize; c++) {
      if (!TICTAC.board[r][c]) {
        available.push({ row: r, col: c })
      }
    }
  }
  if (available.length > 0) {
    const move = available[Math.floor(Math.random() * available.length)]
    TICTAC.board[move.row][move.col] = TICTAC.currentPlayer
    TICTAC.lastMove = move
  }
}

// === input ===
const keys = new Set()
const pointer = { x: 0, y: 0, active: false }
const HELD_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']

window.addEventListener('keydown', (event) => {
  keys.add(event.key)
  if (HELD_KEYS.includes(event.key)) event.preventDefault()
})
window.addEventListener('keyup', (event) => keys.delete(event.key))

function trackPointer(event) {
  const bounds = canvas.getBoundingClientRect()
  pointer.x = event.clientX - bounds.left
  pointer.y = event.clientY - bounds.top
}

canvas.addEventListener('pointerdown', (event) => {
  pointer.active = true
  trackPointer(event)
  handleGridInput(event)
})
canvas.addEventListener('pointermove', trackPointer)
window.addEventListener('pointerup', () => {
  pointer.active = false
})

canvas.addEventListener('click', (event) => {
  handleGridInput(event)
})

function handleGridInput(event) {
  if (TICTAC.gameOver) return
  const bounds = canvas.getBoundingClientRect()
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top
  const cell = getCell(x, y)
  if (cell && !TICTAC.board[cell.row][cell.col]) {
    makeMove(cell)
  }
}

function makeMove(cell) {
  TICTAC.board[cell.row][cell.col] = TICTAC.currentPlayer
  TICTAC.lastMove = cell
  
  const win = checkWin(TICTAC.board)
  if (win) {
    TICTAC.winner = win.winner
    TICTAC.gameOver = true
  } else {
    // Switch player
    TICTAC.currentPlayer = TICTAC.currentPlayer === 'X' ? 'O' : 'X'
    
    // AI turn
    if (TICTAC.currentPlayer === 'O' && TICTAC.mode === 'pve') {
      setTimeout(makeRandomMove, 300)
    }
  }
  game.tictactoe = { ...TICTAC }
}

// === update ===
function update(dt) {
  game.time += dt
  const step = CONFIG.playerSpeed * dt
  if (keys.has('ArrowLeft') || keys.has('a')) game.player.x -= step
  if (keys.has('ArrowRight') || keys.has('d')) game.player.x += step
  if (keys.has('ArrowUp') || keys.has('w')) game.player.y -= step
  if (keys.has('ArrowDown') || keys.has('s')) game.player.y += step
  if (pointer.active) {
    const follow = Math.min(1, dt * 8)
    game.player.x += (pointer.x - game.player.x) * follow
    game.player.y += (pointer.y - game.player.y) * follow
  }
  const edge = game.player.radius
  game.player.x = clamp(game.player.x, edge, canvas.width - edge)
  game.player.y = clamp(game.player.y, edge, canvas.height - edge)
  game.score = Math.floor(game.time * 10)

  // Update Tic-Tac-Toe score
  const filled = TICTAC.board.flat().filter(c => c !== null).length
  game.score = filled
}

// === draw ===
function draw() {
  ctx.fillStyle = CONFIG.background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw Tic-Tac-Toe board
  const boardX = CONFIG.boardPadding
  const boardY = CONFIG.boardPadding
  
  // Draw grid lines
  ctx.strokeStyle = CONFIG.accent
  ctx.lineWidth = 4
  ctx.beginPath()
  
  // Horizontal lines
  for (let i = 1; i < CONFIG.gridSize; i++) {
    const y = boardY + i * (CONFIG.cellSize + CONFIG.gap)
    ctx.moveTo(boardX, y)
    ctx.lineTo(boardX + CONFIG.gridSize * (CONFIG.cellSize + CONFIG.gap), y)
  }
  // Vertical lines
  for (let i = 1; i < CONFIG.gridSize; i++) {
    const x = boardX + i * (CONFIG.cellSize + CONFIG.gap)
    ctx.moveTo(x, boardY)
    ctx.lineTo(x, boardY + CONFIG.gridSize * (CONFIG.cellSize + CONFIG.gap))
  }
  ctx.stroke()
  
  // Draw X and O markers
  for (let row = 0; row < CONFIG.gridSize; row++) {
    for (let col = 0; col < CONFIG.gridSize; col++) {
      const x = boardX + col * (CONFIG.cellSize + CONFIG.gap) + CONFIG.cellSize / 2
      const y = boardY + row * (CONFIG.cellSize + CONFIG.gap) + CONFIG.cellSize / 2
      
      if (TICTAC.board[row][col]) {
        ctx.fillStyle = TICTAC.board[row][col] === 'X' ? CONFIG.accent : CONFIG.accent2
        ctx.beginPath()
        ctx.arc(x, y, CONFIG.cellSize / 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  
  // Draw current player indicator
  if (!TICTAC.gameOver && TICTAC.currentPlayer === 'X' && TICTAC.mode === 'pvp') {
    ctx.fillStyle = '#f2f4f8'
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillText('Player 1 (X)', boardX - 60, boardY - 10)
  }
  if (!TICTAC.gameOver && TICTAC.currentPlayer === 'O' && TICTAC.mode === 'pvp') {
    ctx.fillStyle = '#f2f4f8'
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillText('Player 2 (O)', boardX - 30, boardY - 10)
  }
  if (!TICTAC.gameOver && TICTAC.mode === 'pve') {
    ctx.fillStyle = '#f2f4f8'
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillText('Your Turn', boardX - 40, boardY - 10)
  }
  
  // Draw winner announcement
  if (TICTAC.winner) {
    ctx.fillStyle = TICTAC.winner === 'X' ? CONFIG.accent : CONFIG.accent2
    ctx.font = 'bold 48px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Player ' + TICTAC.winner + ' Wins!', canvas.width / 2, canvas.height / 2)
    ctx.textAlign = 'left'
  }
  
  // Draw score
  ctx.fillStyle = '#f2f4f8'
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillText('Score: ' + game.score, 16, 28)
  
  // Draw player indicator (original game)
  ctx.fillStyle = CONFIG.accent
  ctx.beginPath()
  ctx.arc(game.player.x, game.player.y, game.player.radius, 0, Math.PI * 2)
  ctx.fill()
}

// === loop ===
let lastFrame = performance.now()

function frame(now) {
  // Clamped at both ends: a hidden tab hands back a dt of several seconds, which
  // teleports everything through everything else on the first frame back, and
  // the first frame's timestamp can predate this script, giving a negative one.
  const dt = Math.min(Math.max((now - lastFrame) / 1000, 0), 0.05)
  lastFrame = now
  if (game.phase === 'playing') update(dt)
  draw()
  requestAnimationFrame(frame)
}

window.addEventListener('resize', resize)
resize()
reset()
requestAnimationFrame(frame)

// === debug hook ===
window.__game = {
  get state() {
    return game.phase
  },
  get score() {
    return game.score
  },
  get entities() {
    return game.entities.length
  },
  reset,
}

// === debug hook ===
// Read by the app when it play-tests this game. Keep these pointing at the real
// state as the game grows; nothing the player sees depends on them.
window.__game = {
  get state() {
    return game.phase
  },
  get score() {
    return game.score
  },
  get entities() {
    return game.entities.length
  },
  reset,
}
