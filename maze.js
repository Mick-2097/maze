const maze = document.querySelector(".maze")
const startButton = document.querySelector(".start")
const resetButton = document.querySelector(".reset")
const message = document.querySelector(".message")
let board = []
let width = 30
let boardSize = width * 16
let options = []
let history = []
let current = 0
let next = 0

let getRandomInt = input => {
  return Math.floor(Math.random() * input)
}

const buildBoard = () => {
  current = 0
  resetButton.classList.add("hidden", "disabled")
  startButton.classList.remove("hidden", "disabled")
  maze.textContent = ""
  message.style.opacity = 0

  for (let i = 0; i < boardSize; i++) {
    let cell = document.createElement("div")
    cell.classList.add("cell")
    cell.id = i
    maze.append(cell)
  }
  board = maze.querySelectorAll(".cell")
}
buildBoard()

let checkRoute = () => {
  let north = current - width
  let east = current + 1
  let south = current + width
  let west = current - 1
  options = []

  //  Look up
  if (current >= width && !board[north].classList.contains("checked")) {
    options.push(board[north].id)
  }
  //  Look right
  if (
    current !== width - 1 &&
    current % width !== width - 1 &&
    current !== boardSize - 1 &&
    !board[east].classList.contains("checked")
  ) {
    options.push(board[east].id)
  }
  //  Look down
  if (
    current < boardSize - width &&
    !board[south].classList.contains("checked")
  ) {
    options.push(board[south].id)
  }
  //  Look left
  if (
    current > 0 &&
    current % width !== 0 &&
    !board[west].classList.contains("checked")
  ) {
    options.push(board[west].id)
  }
}

let recursion = time => {
  board[current].classList.add("current")
  setTimeout(() => {
    if (history.length) {
      buildMaze()
    } else {
      current = 0
      board[current].classList.remove("current")
      board[current].classList.add("player")
      board[479].classList.add("goal")
      message.textContent = "Head for the goal!"
      message.style.opacity = 1
    }
  }, time) // Set at line 121 for maze build animation apeed
}

let buildMaze = () => {
  startButton.classList.add("hidden", "disabled")
  history.unshift(current)
  board[current].classList.remove("current")

  if (!board[current].classList.contains("checked")) {
    board[current].classList.add("checked")
  }
  checkRoute()

  if (options.length) {
    //  Set next
    next = +options[getRandomInt(options.length)]
    //  Move up
    if (current - width === next) {
      board[current].classList.add("top-none")
      board[next].classList.add("bottom-none", "checked")
    }
    //  Move right
    if (current + 1 === next) {
      board[current].classList.add("right-none")
      board[next].classList.add("left-none", "checked")
    }
    //  Move down
    if (current + width === next) {
      board[current].classList.add("bottom-none")
      board[next].classList.add("top-none", "checked")
    }
    //  Move left
    if (current - 1 === next) {
      board[current].classList.add("left-none")
      board[next].classList.add("right-none", "checked")
    }
    current = next
    next = 0
  } else {
    //  Backtrack until options.length
    history.shift()
    current = history[0]
    history.shift()
  }
  recursion(5) // <<<<<<<<<<<<<<<<<<<<<<<<<<<  Set maze build animation speed
}

document.addEventListener("keydown", event => {
  message.style.opacity = 0
  //  Up key
  if (
    board[current].classList.contains("top-none") &&
    event.key === "ArrowUp"
  ) {
    board[current].classList.remove("player")
    current -= width
    board[current].classList.add("player")
  }
  //  Right key
  if (
    board[current].classList.contains("right-none") &&
    event.key === "ArrowRight"
  ) {
    board[current].classList.remove("player")
    current++
    board[current].classList.add("player")
  }
  //  Down key
  if (
    board[current].classList.contains("bottom-none") &&
    event.key === "ArrowDown"
  ) {
    board[current].classList.remove("player")
    current += width
    board[current].classList.add("player")
  }
  //  Left key
  if (
    board[current].classList.contains("left-none") &&
    event.key === "ArrowLeft"
  ) {
    board[current].classList.remove("player")
    current--
    board[current].classList.add("player")
  }

  //  End game
  if (board[479].classList.contains("player")) {
    resetButton.classList.remove("hidden", "disabled")
    board[boardSize - 1].classList.remove("top-none", "left-none")
    message.textContent = "Congratulations you did it!!"
    message.style.opacity = 1
  }
})
