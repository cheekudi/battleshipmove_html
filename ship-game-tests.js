let ship1, ship2, regularBoard, boundaryTestBoard;

// Initialize the regular game board
function initializeGameState() {
  ship1 = { shipid: 1, hits: 0, size: 2 };
  ship2 = { shipid: 2, hits: 0, size: 3 };
  regularBoard = [
    { row: 3, col: 1, isHit: false, ship: ship2 },
    { row: 3, col: 2, isHit: false, ship: ship2 },
    { row: 3, col: 3, isHit: false, ship: ship2 },
    { row: 3, col: 4, isHit: false, ship: ship1 },
    { row: 4, col: 4, isHit: false, ship: ship1 },
  ];
}

// Initialize the boundary test board
function initializeBoundaryTestBoard() {
  ship1 = { shipid: 1, hits: 0, size: 2 };
  ship2 = { shipid: 2, hits: 0, size: 3 };

  // Creating a 5x5 board with ships on the boundaries
  boundaryTestBoard = [
    { row: 1, col: 1, isHit: false, ship: ship1 },
    { row: 1, col: 2, isHit: false, ship: ship1 },
    { row: 5, col: 3, isHit: false, ship: ship2 },
    { row: 5, col: 4, isHit: false, ship: ship2 },
    { row: 5, col: 5, isHit: false, ship: ship2 },
  ];
}

// Function to check if a ship is hit, sunk, or missed
function check(board, location) {
  // check for invalid input (i.e. row or col missing or not a number)
  if (!location || !location.row || !location.col) {
    return "Invalid input";
  }

  const row = location.row;
  const col = location.col;

  // check for out of bounds (for testing we are using 5x5 grid)
  if (
    !Number.isInteger(location.row) ||
    !Number.isInteger(location.col) ||
    row < 1 ||
    row > 5 ||
    col < 1 ||
    col > 5
  ) {
    return "Invalid input";
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i].row === row && board[i].col === col) {
      // Check if the ship is already sunk
      if (board[i].ship.hits === board[i].ship.size) {
        return "Already sunk";
      }
      // Check if this is a Duplicate hit
      if (board[i].isHit) {
        return "Duplicate hit";
      }
      // Else Increment the Hit count and register the hit for duplicate detection
      board[i].isHit = true;
      board[i].ship.hits += 1;
      // If Hit count equals its size, mark ship as sunk otherwise it's a Hit
      if (board[i].ship.hits === board[i].ship.size) {
        return "Sink";
      } else {
        return "Hit";
      }
    }
  }

  return "Miss";
}

// Create a visual representation of the board, displaying ship locations, hits, and misses
function renderBoard(board) {
  let boardHTML = "";

  for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
      const cell = document.createElement("div");
      cell.classList.add("board-cell");

      const boardCell = board.find((c) => c.row === row && c.col === col);
      if (boardCell) {
        cell.classList.add(boardCell.isHit ? "Hit" : "ship");
      } else {
        cell.classList.add("water");
      }

      boardHTML += cell.outerHTML;
    }
    // Add a line break after each row
    boardHTML += "<br>";
  }

  return boardHTML;
}

// Define test cases
const testGroups = [
  {
    title: "Basic Game Actions",
    getBoard: () => regularBoard,
    boardSetup: initializeGameState,
    tests: [
      {
        title: "Check for Miss",
        location: { row: 2, col: 1 },
        expectedOutput: "Miss",
      },
      {
        title: "Check for Hit",
        location: { row: 3, col: 1 },
        expectedOutput: "Hit",
      },
      {
        title: "Check for Hit",
        location: { row: 3, col: 2 },
        expectedOutput: "Hit",
      },
    ],
  },
  {
    title: "Duplicate hits and Sinking",
    getBoard: () => regularBoard,
    boardSetup: initializeGameState,
    tests: [
      {
        title: "Check for Hit",
        location: { row: 3, col: 1 },
        expectedOutput: "Hit",
      },
      {
        title: "Check for Duplicate hit",
        location: { row: 3, col: 1 },
        expectedOutput: "Duplicate hit",
      },
      {
        title: "Check for Hit",
        location: { row: 3, col: 2 },
        expectedOutput: "Hit",
      },
      {
        title: "Check for Sink",
        location: { row: 3, col: 3 },
        expectedOutput: "Sink",
      },
      {
        title: "Check for Already sunk",
        location: { row: 3, col: 1 },
        expectedOutput: "Already sunk",
      },
    ],
  },
  {
    title: "Boundary on 5x5 Grid",
    getBoard: () => boundaryTestBoard,
    boardSetup: initializeBoundaryTestBoard,
    tests: [
      {
        title: "Top-left corner hit",
        location: { row: 1, col: 1 },
        expectedOutput: "Hit",
      },
      {
        title: "Top-right corner hit",
        location: { row: 1, col: 5 },
        expectedOutput: "Miss",
      },
      {
        title: "Bottom-right corner hit",
        location: { row: 5, col: 5 },
        expectedOutput: "Hit",
      },
      {
        title: "Bottom-left corner hit",
        location: { row: 5, col: 1 },
        expectedOutput: "Miss",
      },
      {
        title: "Middle edge top",
        location: { row: 1, col: 2 },
        expectedOutput: "Sink",
      },
      {
        title: "Middle edge bottom",
        location: { row: 5, col: 3 },
        expectedOutput: "Hit",
      },
      {
        title: "Middle edge left",
        location: { row: 3, col: 1 },
        expectedOutput: "Miss",
      },
      {
        title: "Middle edge right",
        location: { row: 3, col: 5 },
        expectedOutput: "Miss",
      },
    ],
  },
  {
    title: "Invalid Inputs",
    getBoard: () => regularBoard,
    boardSetup: initializeGameState,
    tests: [
      {
        title: "Negative row",
        location: { row: -1, col: 5 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Negative column",
        location: { row: 5, col: -1 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Row out of bounds",
        location: { row: 6, col: 5 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Column out of bounds",
        location: { row: 5, col: 6 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Both row and column out of bounds",
        location: { row: 11, col: 11 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Non-integer row",
        location: { row: 3.5, col: 1 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Non-integer column",
        location: { row: 1, col: 4.5 },
        expectedOutput: "Invalid input",
      },
      {
        title: "String inputs",
        location: { row: "a", col: "b" },
        expectedOutput: "Invalid input",
      },
    ],
  },
];

// Function to run a single test case
function runTest(testCase, board) {
  const output = check(board, testCase.location);
  const result = output === testCase.expectedOutput ? "Pass" : "Fail";
  return { output, result };
}

// Get the element where test cases will be displayed
const testCasesElement = document.getElementById("test-cases");

// Iterate through each test group
testGroups.forEach((group) => {
  // Reset the game state at the beginning of each group
  group.boardSetup();
  const board = group.getBoard();
  console.log(board);

  const groupElement = document.createElement("div");
  groupElement.classList.add("test-group");
  groupElement.innerHTML = `<h2>Test Cases for ${group.title}</h2>`;

  group.tests.forEach((testCase) => {
    // Render the board state before the test case
    const boardBefore = renderBoard(board);

    // Run the test case
    const { output, result } = runTest(testCase, board);

    // Render the board state after the test case
    const boardAfter = renderBoard(board);

    // Create and append the test case element
    const testCaseElement = document.createElement("div");
    testCaseElement.classList.add("test-case");

    testCaseElement.innerHTML = `
      <div class="header">
        ${testCase.title}: Location [${testCase.location.row}, ${testCase.location.col}]
      </div>
      <div class="board-container">
          <div class="board-heading">Board Before:</div>
          <div class="game-board">${boardBefore}</div>
        </div>
        <div class="output-container">
            <div class="output-label">Expected Output:</div>
            <div class="output-value">${testCase.expectedOutput}</div>
        </div>
        <div class="output-container">
            <div class="output-label">Actual Output:</div>
            <div class="output-value">${output}</div>
        </div>
        <div class="board-container">
          <div class="board-heading">Board After:</div>
          <div class="game-board">${boardAfter}</div>
        </div>
      <div class="result">
        Result: ${result}
      </div>
    `;

    groupElement.appendChild(testCaseElement);
  });

  testCasesElement.appendChild(groupElement);
});
