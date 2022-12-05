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
    for (let colInd = 0; colInd < 50; colInd++) {
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

export const getPath = (
  grid: CellInterface[][],
  startPoint: CellInterface,
  endPoint: CellInterface
) => {
  let path = getShortestPathCells(grid, startPoint, endPoint) || [];
  return path;
};

export function getShortestPathCells(
  grid: CellInterface[][],
  startCell: CellInterface,
  endCell: CellInterface
) {
  const pathCells = [];
  let currentCell: CellInterface | null = endCell;
  while (currentCell) {
    if (
      currentCell.row + 1 < grid.length &&
      grid[currentCell.row + 1][currentCell.col].cellNumber ===
        startCell.cellNumber
    ) {
      pathCells.push(currentCell);
      return pathCells;
    }
    if (
      currentCell.row - 1 >= 0 &&
      grid[currentCell.row - 1][currentCell.col].cellNumber ===
        startCell.cellNumber
    ) {
      pathCells.push(currentCell);
      return pathCells;
    }
    if (
      currentCell.col + 1 < grid[0].length &&
      grid[currentCell.row][currentCell.col + 1].cellNumber ===
        startCell.cellNumber
    ) {
      pathCells.push(currentCell);
      return pathCells;
    }
    if (
      currentCell.col - 1 >= 0 &&
      grid[currentCell.row][currentCell.col - 1].cellNumber ===
        startCell.cellNumber
    ) {
      pathCells.push(currentCell);
      return pathCells;
    }
    pathCells.push(currentCell);
    currentCell = currentCell.previousCell;
  }

  return pathCells;
}
