# Tic-Tac-Toe Game Design

## Current State
- A canvas-based game with a moving player (blue circle)
- Arrow keys/WASD controls
- Score tracking based on time
- Resize support

## Target Implementation

### Game Modes
1. **Player vs Player** - Classic 3x3 grid
2. **Player vs AI** - Simple algorithm

### Core Mechanics
- 3x3 grid with X and O markers
- Win detection (rows, columns, diagonals)
- Draw detection (tie game)
- Turn-based gameplay

### UI Elements
- Game board (3x3 grid)
- Player indicators (X and O)
- Current turn display
- Winner announcement
- Restart button

### AI Algorithm
- Random moves for simple version
- Minimax for advanced version

### Sections to Modify in game.js
1. `// === config ===` - Add game mode settings, grid size
2. `// === state ===` - Add grid, turn, winner states
3. `// === input ===` - Add grid cell clicks
4. `// === update ===` - Add game logic, AI moves
5. `// === draw ===` - Add grid, markers, UI
6. `// === loop ===` - Keep as is
7. `// === debug hook ===` - Keep as is

## Implementation Priority
1. Create grid and draw markers
2. Add click input for cells
3. Implement win/draw detection
4. Add AI opponent
5. Polish UI
