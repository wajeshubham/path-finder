import { CellInterface } from "../../interfaces";
import {
  generateOddRandomNumber,
  generateRandomNumberWithin,
} from "../../utils/helpers";

const addWalls = (
  grid: CellInterface[][],
  direction: "up-down" | "right-left",
  num: number,
  horizontal: number[],
  vertical: number[],
  startNode: CellInterface | null,
  finishNode: CellInterface | null
) => {
  let isStartFinish = false;
  let cellToBeWall = []; // keeping an array to add gaps once we push into it

  if (direction === "up-down") {
    if (vertical.length === 2) return;
    for (let cellRow of vertical) {
      if (
        (cellRow === startNode?.row && num === startNode?.col) ||
        (cellRow === finishNode?.row && num === finishNode?.col)
      ) {
        isStartFinish = true;
        continue;
      }
      cellToBeWall.push([cellRow, num]);
    }
  } else {
    if (horizontal.length === 2) return;
    for (let cellCol of horizontal) {
      if (
        (num === startNode?.row && cellCol === startNode?.col) ||
        (num === finishNode?.row && cellCol === finishNode?.col)
      ) {
        isStartFinish = true;
        continue;
      }
      cellToBeWall.push([num, cellCol]);
    }
  }
  if (!isStartFinish) {
    let rand = generateRandomNumberWithin(cellToBeWall.length);
    // Add gap into the wall
    cellToBeWall = [
      ...cellToBeWall.slice(0, rand),
      ...cellToBeWall.slice(rand + 1),
    ];
  }
  for (let wall of cellToBeWall) {
    grid[wall[0]][wall[1]].isWall = true;
  }
};

const setRecursiveWalls = (
  horizontal: number[],
  vertical: number[],
  grid: CellInterface[][],
  startNode: CellInterface | null,
  finishNode: CellInterface | null
) => {
  if (horizontal.length < 2 || vertical.length < 2) return; // stop recursion if we can't split further
  let direction: "up-down" | "right-left" = "up-down";
  let num: number = 0;
  if (horizontal.length > vertical.length) {
    direction = "up-down";
    num = generateOddRandomNumber(horizontal);
  }
  if (horizontal.length <= vertical.length) {
    direction = "right-left";
    num = generateOddRandomNumber(vertical);
  }

  // recursive part where the approach to
  // start vertical or horizontal is dependent on direction variable
  if (direction === "up-down") {
    addWalls(grid, direction, num, horizontal, vertical, startNode, finishNode);
    setRecursiveWalls(
      horizontal.slice(0, horizontal.indexOf(num)),
      vertical,
      grid,
      startNode,
      finishNode
    );
    setRecursiveWalls(
      horizontal.slice(horizontal.indexOf(num) + 1),
      vertical,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWalls(grid, direction, num, horizontal, vertical, startNode, finishNode);
    setRecursiveWalls(
      horizontal,
      vertical.slice(0, vertical.indexOf(num)),
      grid,
      startNode,
      finishNode
    );
    setRecursiveWalls(
      horizontal,
      vertical.slice(vertical.indexOf(num) + 1),
      grid,
      startNode,
      finishNode
    );
  }
};

export const generateRecursiveMaze = (
  grid: CellInterface[][],
  startNode: CellInterface | null,
  finishNode: CellInterface | null
) => {
  let horizontal = Array(grid[0].length)
    .fill("_")
    .map((_, i) => i);
  let vertical = Array(grid.length)
    .fill("_")
    .map((_, i) => i);

  setRecursiveWalls(horizontal, vertical, grid, startNode, finishNode);
};
