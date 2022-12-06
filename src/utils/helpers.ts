import { CellInterface } from "../interfaces";

let singleCell: CellInterface = {
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

export const getCellObjects = (): CellInterface[][] => {
  let gridCells: CellInterface[][] = [];
  let cellNumber = 0;
  for (let rowInd = 0; rowInd < 30; rowInd++) {
    let currentRow: CellInterface[] = [];
    for (let colInd = 0; colInd < 52; colInd++) {
      currentRow.push({ ...singleCell, row: rowInd, col: colInd, cellNumber });
      cellNumber++;
    }
    gridCells.push(currentRow);
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
