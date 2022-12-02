import { CellInterface } from "../interfaces";
import { getCells } from "../utils/helpers";

const getNeighbors = (currentCell: CellInterface, grid: CellInterface[][]) => {
  const neighbors: CellInterface[] = [];
  const { col, row } = currentCell;

  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  return neighbors.filter((n) => !n?.isVisited);
};

const traverseFurtherInGrid = (
  currentCell: CellInterface,
  grid: CellInterface[][]
) => {
  let remainingNeighbors = getNeighbors(currentCell, grid);
  for (let cell of remainingNeighbors) {
    cell.distanceFromStart = currentCell.distanceFromStart + 1;
    cell.previousCell = currentCell;
  }
};

export const dijkstra = (
  grid: CellInterface[][],
  startCell: CellInterface,
  endCell: CellInterface
) => {
  let unvisitedCells = getCells(grid); // clone
  startCell.distanceFromStart = 0;
  let visitedCells: CellInterface[] = [];
  while (!!unvisitedCells.length) {
    unvisitedCells.sort(
      (cellA, cellB) => cellA.distanceFromStart - cellB.distanceFromStart
    );
    let currentCell = unvisitedCells.shift(); // remove 1st cell

    if (!currentCell) return visitedCells;
    if (currentCell?.isWall) continue; // ignore walls
    if (currentCell?.distanceFromStart === Infinity) return visitedCells; // the walls are closed
    currentCell.isVisited = true;
    visitedCells.push(currentCell);
    if (currentCell.cellNumber === endCell.cellNumber) return visitedCells;
    traverseFurtherInGrid(currentCell, grid);
  }
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
