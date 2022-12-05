import React, { useEffect, useRef, useState } from "react";
import { CellInterface, SearchingAlgoEnum } from "../interfaces";
import { getCellObjects, getPath } from "../utils/helpers";
import Cell from "./Cell";
import { dijkstra } from "../app/algorithms/dijkstra";
import { BFS } from "../app/algorithms/BFS";
import { DFS } from "../app/algorithms/DFS";
import { generateRandomMaze } from "../app/maze/randomMaze";

const GridBoard = () => {
  const gridBoardCells = useRef(getCellObjects());

  const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
  const [foundPath, setFoundPath] = useState<CellInterface[] | null>(null);

  const [cellsScanned, setCellsScanned] = useState(0);
  const [cellsTraveled, setCellsTraveled] = useState(0);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [renderFlag, setRenderFlag] = useState(false);

  const onMouseEnter = (rowIndex: number, colIndex: number) => {
    setRenderFlag(!renderFlag);
    let element = gridBoardCells.current[rowIndex];
    if (!isMouseDown) return;
    if (element[colIndex].isStartPoint || element[colIndex].isEndPoint) return;

    element[colIndex].isWall = !element[colIndex].isWall;
  };

  const onCellClick = (
    cell: CellInterface,
    rowIndex: number,
    colIndex: number
  ) => {
    let clickedCell = gridBoardCells.current[rowIndex][colIndex];
    if (clickedCell.isWall) {
      clickedCell.isWall = false;
      return;
    }
    if (cell.cellNumber === startPoint?.cellNumber) {
      setStartPoint(null);
      clickedCell.isStartPoint = false;
      clickedCell.distanceFromStart = Infinity;
      return;
    }
    if (cell.cellNumber === endPoint?.cellNumber) {
      setEndPoint(null);
      clickedCell.isEndPoint = false;
      return;
    }

    if (startPoint && endPoint) {
      clickedCell.isWall = true;
      return;
    }
    if (!startPoint) {
      setStartPoint({
        ...clickedCell,
        isStartPoint: true,
        distanceFromStart: 0,
      });
      clickedCell.isStartPoint = true;
      clickedCell.distanceFromStart = 0;
    } else if (startPoint) {
      setEndPoint({
        ...clickedCell,
        isEndPoint: true,
      });
      clickedCell.isEndPoint = true;
    }
  };

  const animateAlgo = (
    visitedCells: CellInterface[],
    path: CellInterface[]
  ) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-visited";
        if (cell.isTarget) {
          setFoundPath(path);
        }
      }, 10 * i);
    }
  };

  const animatePath = (path: CellInterface[]) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const cell = path[i];
        setCellsTraveled(i + 1);
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " !bg-red-600";
      }, 25 * i);
    }
  };

  const visualizeAlgo = (type: SearchingAlgoEnum) => {
    if (!startPoint || !endPoint) return;
    let grid = gridBoardCells.current;
    let start = grid[startPoint.row][startPoint.col];
    let end = grid[endPoint.row][endPoint.col];
    let visitedCells: CellInterface[] = [];
    switch (type) {
      case SearchingAlgoEnum.DIJKSTRA:
        visitedCells = dijkstra(grid, start, end) || [];
        break;
      case SearchingAlgoEnum.DFS:
        visitedCells = DFS(grid, start, end) || [];
        break;
      case SearchingAlgoEnum.BFS:
        visitedCells = BFS(grid, start, end) || [];
        break;
    }
    const path = getPath(grid, start, end);
    setCellsScanned(visitedCells.length);
    animateAlgo(visitedCells, path);
  };

  useEffect(() => {
    if (foundPath && startPoint && endPoint) {
      animatePath(foundPath);
    }
  }, [foundPath]);

  return (
    <>
      <div className="flex gap-6">
        <button onClick={() => visualizeAlgo(SearchingAlgoEnum.DIJKSTRA)}>
          Visualize dijkstra
        </button>
        <br />
        <button onClick={() => visualizeAlgo(SearchingAlgoEnum.BFS)}>
          Visualize BFS
        </button>
        <br />
        <button onClick={() => visualizeAlgo(SearchingAlgoEnum.DFS)}>
          Visualize DFS
        </button>
        <br />

        <button
          onClick={() => {
            generateRandomMaze(gridBoardCells.current);
            setRenderFlag(!renderFlag);
          }}
        >
          Generate random maze
        </button>
        <br />
        <button>Pause</button>
        <p>Total cells scanned: {cellsScanned}</p>
        <p>Cells traveled: {cellsTraveled}</p>
      </div>
      <div className="grid grid-cols-gridmap justify-center items-center">
        {gridBoardCells.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell
                    key={colIndex}
                    id={`cell-${cell.row}-${cell.col}`}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onMouseEnter={() => {
                      onMouseEnter(rowIndex, colIndex);
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    onClick={() => {
                      onCellClick(cell, rowIndex, colIndex);
                    }}
                    {...cell}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default GridBoard;
