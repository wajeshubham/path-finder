import React, { useEffect, useRef, useState } from "react";
import { CellInterface } from "../interfaces";
import { getCellObjects } from "../utils/helpers";
import Cell from "./Cell";
import { dijkstra, getShortestPathCells } from "../app/dijkstra";

const GridBoard = () => {
  const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [foundPath, setFoundPath] = useState(false);
  const gridBoardCells = useRef(getCellObjects());
  const [cellsScanned, setCellsScanned] = useState(0);
  const [renderFlag, setRenderFlag] = useState(false);

  const animateDijkstra = (visitedCells: CellInterface[]) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-visited";
        if (i >= visitedCells.length - 1) {
          setFoundPath(true);
        }
      }, 2 * i);
    }
  };

  const animatePath = (shortestPath: CellInterface[]) => {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const cell = shortestPath[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " !bg-blue-500";
      }, 25 * i);
    }
  };

  const visualizeDijkstra = () => {
    if (!startPoint || !endPoint) return;
    let grid = gridBoardCells.current;
    let visitedCells =
      dijkstra(
        grid,
        grid[startPoint.row][startPoint.col],
        grid[endPoint.row][endPoint.col]
      ) || [];
    setCellsScanned(visitedCells.length);
    animateDijkstra(visitedCells);
  };

  useEffect(() => {
    if (foundPath && startPoint && endPoint) {
      let grid = gridBoardCells.current;
      let shortestPath =
        getShortestPathCells(grid[endPoint.row][endPoint.col]) || [];
      animatePath(shortestPath);
    }
  }, [foundPath]);

  return (
    <>
      <button onClick={visualizeDijkstra}>Visualize</button>
      <button>Pause</button>
      <p>Total cells scanned: {cellsScanned}</p>

      <div className="grid grid-cols-gridmap justify-center items-center">
        {gridBoardCells.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell
                    key={colIndex}
                    id={`cell-${cell.row}-${cell.col}`}
                    {...cell}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onMouseEnter={() => {
                      setRenderFlag(!renderFlag);
                      let element = gridBoardCells.current[rowIndex];
                      if (!isMouseDown) return;
                      if (
                        element[colIndex].isStartPoint ||
                        element[colIndex].isEndPoint
                      )
                        return;

                      element[colIndex].isWall = !element[colIndex].isWall;
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    onClick={() => {
                      let clickedCell =
                        gridBoardCells.current[rowIndex][colIndex];
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

                      if (startPoint && endPoint) return;
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
                    }}
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
