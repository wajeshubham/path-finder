export interface CellInterface {
  cellNumber: number;
  col: number;
  row: number;
  isVisited: boolean;
  isWall: boolean;
  isStartPoint: boolean;
  isEndPoint: boolean;
  distanceFromStart: number;
  previousNode: CellInterface | null;
}
