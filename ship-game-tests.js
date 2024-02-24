let ship1, ship2, currentBoard;

function initializeGameState() {
  ship1 = { shipid: 1, Hits: 0, size: 2 };
  ship2 = { shipid: 2, Hits: 0, size: 3 };
  currentBoard = [
    { row: 3, col: 1, isHit: false, ship: ship2 },
    { row: 3, col: 2, isHit: false, ship: ship2 },
    { row: 3, col: 3, isHit: false, ship: ship2 },
    { row: 3, col: 4, isHit: false, ship: ship1 },
    { row: 4, col: 4, isHit: false, ship: ship1 },
  ];
}

// Function to check if a ship is hit, sunk, or missed
function check(location) {
  // check for invalid input (i.e. row or col missing or not a number)
  if (
    !location ||
    !location.row ||
    !location.col ||
    isNaN(location.row) ||
    isNaN(location.col)
  ) {
    return "Invalid input";
  }

  const row = location.row;
  const col = location.col;

  // check for out of bounds (assuming grid is 10x10)
  if (row < 1 || row > 10 || col < 1 || col > 10) {
    return "Invalid input";
  }

  for (let i = 0; i < currentBoard.length; i++) {
    if (currentBoard[i].row === row && currentBoard[i].col === col) {
      // Check if the ship is already sunk
      if (currentBoard[i].ship.Hits === currentBoard[i].ship.size) {
        return "Already sunk";
      }
      // Check if this is a Duplicate hit
      if (currentBoard[i].isHit) {
        return "Duplicate hit";
      }
      // Else Increment the Hit count and register the hit for duplicate detection
      currentBoard[i].isHit = true;
      currentBoard[i].ship.Hits += 1;
      // If Hit count equals its size, mark ship as sunk otherwise it's a Hit
      if (currentBoard[i].ship.Hits === currentBoard[i].ship.size) {
        return "Sink";
      } else {
        return "Hit";
      }
    }
  }

  return "Miss";
}

// Create a visual representation of the board, displaying ship locations, hits, and misses
function renderBoard() {
  let boardHTML = "";

  for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
      const cell = document.createElement("div");
      cell.classList.add("board-cell");

      // Check if the cell is part of the currentBoard
      const boardCell = currentBoard.find(
        (c) => c.row === row && c.col === col
      );
      if (boardCell) {
        cell.classList.add(boardCell.isHit ? "Hit" : "ship");
      } else {
        cell.classList.add("water");
      }

      boardHTML += cell.outerHTML;
    }
    boardHTML += "<br>"; // Break line after each row
  }

  return boardHTML;
}

// Define test cases
const testGroups = [
  {
    title: "Basic Game Actions",
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
    title: "Invalid Inputs",
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
        location: { row: 11, col: 5 },
        expectedOutput: "Invalid input",
      },
      {
        title: "Column out of bounds",
        location: { row: 5, col: 11 },
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
function runTest(testCase) {
  const output = check(testCase.location);
  const result = output === testCase.expectedOutput ? "Pass" : "Fail";
  return { output, result };
}

// Get the element where test cases will be displayed
const testCasesElement = document.getElementById("test-cases");

// Iterate through each test group
testGroups.forEach((group) => {
  initializeGameState(); // Reset the game state at the beginning of each group

  const groupElement = document.createElement("div");
  groupElement.classList.add("test-group");
  groupElement.innerHTML = `<h2>Test Cases for ${group.title}</h2>`;

  group.tests.forEach((testCase) => {
    // Render the board state before the test case
    const boardBefore = renderBoard();

    // Run the test case
    const { output, result } = runTest(testCase);

    // Render the board state after the test case
    const boardAfter = renderBoard();

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
