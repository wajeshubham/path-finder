import { CellInterface } from "../interfaces";

export const singleCell: CellInterface = {
  cellNumber: 0,
  col: 0,
  row: 0,
  isVisited: false,
  isWall: false,
  isStartPoint: false,
  isEndPoint: false,
  distanceFromStart: Infinity,
  previousCell: null,
  isTarget: false,
};

export const getCellObjects = (
  resetOnlyPath: boolean = false,
  resetOnlyWalls: boolean = false,
  grid?: CellInterface[][]
): CellInterface[][] => {
  let gridCells: CellInterface[][] = grid || [];
  let cellNumber = 0;
  for (let rowInd = 0; rowInd < 30; rowInd++) {
    let currentRow: CellInterface[] = [];
    for (let colInd = 0; colInd < 52; colInd++) {
      if ((resetOnlyPath || resetOnlyWalls) && grid) {
        // don't recreate the grid instead just reset the path and walls flag conditionally
        grid[rowInd][colInd].isVisited = false;
        grid[rowInd][colInd].distanceFromStart = Infinity;
        grid[rowInd][colInd].isTarget = false;
        grid[rowInd][colInd].previousCell = null;
        if (resetOnlyWalls) {
          grid[rowInd][colInd].isWall = false;
        }
      } else {
        currentRow.push({
          ...singleCell,
          row: rowInd,
          col: colInd,
          cellNumber,
        });
      }
      cellNumber++;
    }
    if (!resetOnlyPath) {
      gridCells.push(currentRow);
    }
  }

  return gridCells;
};

export const getCells = (grid: CellInterface[][]) => {
  let cellsArray: CellInterface[] = [];
  [...grid].forEach((row) => {
    row.forEach((cell) => {
      cellsArray.push(cell);
    });
  });
  return cellsArray;
};

export const getPath = (endPoint: CellInterface) => {
  let path = getShortestPathCells(endPoint) || [];
  return path;
};

export function getShortestPathCells(endCell: CellInterface) {
  const pathCells = [];
  let currentCell: CellInterface | null = endCell;
  while (currentCell) {
    pathCells.push(currentCell);
    currentCell = currentCell.previousCell;
  }

  return pathCells;
}

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const generateOddRandomNumber = (numberArray: number[]) => {
  let max = numberArray.length - 1;
  let randomNum = Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 === 0) {
    if (randomNum === max) randomNum -= 1;
    else randomNum += 1;
  }
  return numberArray[randomNum];
};

export const generateRandomNumberWithin = (maxValue: number) => {
  let randomNum = Math.floor(Math.random() * (maxValue / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === maxValue) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return randomNum;
};
