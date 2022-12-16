import { CellInterface } from "../../interfaces";

// Visit your neighbors
export function BFS(
  grid: CellInterface[][],
  startCell: CellInterface,
  endCell: CellInterface
): [CellInterface[], number] {
  let startTime = Date.now();
  let endTime;

  let unvisitedCellsQueue: CellInterface[] = [startCell];
  let visitedCells: CellInterface[] = [];

  startCell.isVisited = true;

  while (unvisitedCellsQueue.length > 0) {
    let currentCell = unvisitedCellsQueue.pop(); // for BFS we want neighbors to get traversed first so we pop() the item which we put first

    if (!currentCell) {
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    const { col, row, cellNumber, isVisited } = currentCell;

    if (cellNumber !== startCell.cellNumber && isVisited) continue; // we don't need to operate on start cell

    visitedCells.push(currentCell);

    if (cellNumber === endCell.cellNumber) {
      currentCell.isTarget = true;
      endTime = Date.now();
      return [visitedCells, endTime - startTime];
    }

    if (
      col + 1 < grid[0].length &&
      !grid[row][col + 1].isWall &&
      !grid[row][col + 1].isVisited
    ) {
      grid[row][col + 1].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row][col + 1]);
      currentCell.isVisited = true;
    }

    if (
      row - 1 >= 0 &&
      !grid[row - 1][col].isWall &&
      !grid[row - 1][col].isVisited
    ) {
      grid[row - 1][col].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row - 1][col]);
      currentCell.isVisited = true;
    }

    if (
      row + 1 < grid.length &&
      !grid[row + 1][col].isWall &&
      !grid[row + 1][col].isVisited
    ) {
      grid[row + 1][col].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row + 1][col]);
      currentCell.isVisited = true;
    }

    if (
      col - 1 >= 0 &&
      !grid[row][col - 1].isWall &&
      !grid[row][col - 1].isVisited
    ) {
      grid[row][col - 1].previousCell = currentCell;
      unvisitedCellsQueue.unshift(grid[row][col - 1]);
      currentCell.isVisited = true;
    }
  }
  endTime = Date.now();
  return [visitedCells, endTime - startTime];
}
