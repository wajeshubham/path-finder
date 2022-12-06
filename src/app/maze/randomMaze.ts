import { CellInterface } from "../../interfaces";
import { getCells } from "../../utils/helpers";

export const generateRandomMaze = (grid: CellInterface[][]) => {
  let grid1DArray = getCells(grid);
  for (let rowIndex = 0; rowIndex < grid1DArray.length; rowIndex++) {
    let element = grid1DArray[rowIndex];
    if (element.isStartPoint || element.isEndPoint) continue;
    element.isWall = element.cellNumber % Math.ceil(Math.random() * 10) === 0;
  }
};
