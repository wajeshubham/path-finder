export interface CellInterface {
  cellNumber: number;
  col: number;
  row: number;
  isVisited: boolean;
  isWall: boolean;
  isStartPoint: boolean;
  isEndPoint: boolean;
  distanceFromStart: number;
  previousCell: CellInterface | null;
  isTarget?: boolean;
}

export enum SearchingAlgoEnum {
  DIJKSTRA = "DIJKSTRA",
  BFS = "BFS",
  DFS = "DFS",
}
