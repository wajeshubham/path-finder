import { CellInterface } from "../interfaces";
import { getCells } from "../utils/helpers";

const getNeighbors = (currentCell: CellInterface, grid: CellInterface[][]) => {
  const neighbors: CellInterface[] = [];
  const { col, row } = currentCell;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n?.isVisited);
};

const traverseFurtherInGrid = (
  currentCell: CellInterface,
  grid: CellInterface[][]
) => {
  let remainingNeighbors = getNeighbors(currentCell, grid);
  for (let cell of remainingNeighbors) {
    cell = {
      ...cell,
      distanceFromStart: currentCell.distanceFromStart + 1,
      previousNode: currentCell,
    };
    grid = grid
      .map((row) => {
        return row.map((c) => (c.cellNumber === cell.cellNumber ? cell : c));
      })
      .map((r) => {
        return r.filter((c) => {
          return c.cellNumber !== currentCell.cellNumber;
        });
      });

    // cell.distanceFromStart = currentCell.distanceFromStart + 1;
    // cell.previousNode = currentCell;
  }
  return [getCells(grid), grid] as const;
};

export const dijkstra = (grid: CellInterface[][], endCell: CellInterface) => {
  let unvisitedCells = getCells(grid); // clone
  let visitedCells: CellInterface[] = [];
  while (!!unvisitedCells.length) {
    unvisitedCells.sort(
      (cellA, cellB) => cellA.distanceFromStart - cellB.distanceFromStart
    );
    let currentCell = unvisitedCells.shift(); // remove 1st cell
    if (!currentCell) return visitedCells;
    if (currentCell?.isWall) continue; // ignore walls
    if (currentCell?.distanceFromStart === Infinity) return visitedCells; // the walls are closed
    currentCell = { ...currentCell, isVisited: true };
    visitedCells.push(currentCell);
    if (currentCell.cellNumber === endCell.cellNumber) return visitedCells;
    let arr = traverseFurtherInGrid(currentCell, grid);
    unvisitedCells = arr[0];
    grid = arr[1];
  }
};

// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
// export function dijkstra(
//   grid: CellInterface[][],
//   startNode: CellInterface,
//   finishNode: CellInterface
// ) {
//   const visitedNodesInOrder = [];
//   startNode.distanceFromStart = 0;
//   const unvisitedNodes = getAllNodes(grid);
//   while (!!unvisitedNodes.length) {
//     sortNodesByDistance(unvisitedNodes);
//     const closestNode = unvisitedNodes.shift();
//     // If we encounter a wall, we skip it.
//     if (!closestNode) return visitedNodesInOrder;
//     if (closestNode.isWall) continue;
//     // If the closest node is at a distance of infinity,
//     // we must be trapped and should therefore stop.
//     if (closestNode.distanceFromStart === Infinity) return visitedNodesInOrder;
//     closestNode.isVisited = true;
//     visitedNodesInOrder.push(closestNode);
//     if (closestNode === finishNode) return visitedNodesInOrder;
//     updateUnvisitedNeighbors(closestNode, grid);
//   }
// }

// function sortNodesByDistance(unvisitedNodes: CellInterface[]) {
//   unvisitedNodes.sort(
//     (nodeA, nodeB) => nodeA.distanceFromStart - nodeB.distanceFromStart
//   );
// }

// function updateUnvisitedNeighbors(
//   node: CellInterface,
//   grid: CellInterface[][]
// ) {
//   const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
//   for (const neighbor of unvisitedNeighbors) {
//     neighbor.distanceFromStart = node.distanceFromStart + 1;
//     neighbor.previousNode = node;
//   }
// }

// function getUnvisitedNeighbors(node: CellInterface, grid: CellInterface[][]) {
//   const neighbors = [];
//   const { col, row } = node;
//   if (row > 0) neighbors.push(grid[row - 1][col]);
//   if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
//   if (col > 0) neighbors.push(grid[row][col - 1]);
//   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
//   return neighbors.filter((neighbor) => !neighbor.isVisited);
// }

// function getAllNodes(grid: CellInterface[][]) {
//   const nodes = [];
//   for (const row of grid) {
//     for (const node of row) {
//       nodes.push(node);
//     }
//   }
//   return nodes;
// }

// // // Backtracks from the finishNode to find the shortest path.
// // // Only works when called *after* the dijkstra method above.
// // export function getNodesInShortestPathOrder(finishNode) {
// //   const nodesInShortestPathOrder = [];
// //   let currentNode = finishNode;
// //   while (currentNode !== null) {
// //     nodesInShortestPathOrder.unshift(currentNode);
// //     currentNode = currentNode.previousNode;
// //   }
// //   return nodesInShortestPathOrder;
// // }
