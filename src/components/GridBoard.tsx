import React, { useEffect, useRef, useState } from "react";
import { CellInterface } from "../interfaces";
import { getCellObjects, getShortestPathCells } from "../utils/helpers";
import Cell from "./Cell";
import { dijkstra } from "../app/dijkstra";

const GridBoard = () => {
  const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [foundPath, setFoundPath] = useState(false);
  const gridBoardCells = useRef(getCellObjects());
  const [cellsScanned, setCellsScanned] = useState(0);
  const [cellsTraveled, setCellsTraveled] = useState(0);
  const [renderFlag, setRenderFlag] = useState(false);

  const generateVerticalMaze = () => {
    for (let colIndex = 0; colIndex < 50; colIndex++) {
      for (let rowIndex = 0; rowIndex < 30; rowIndex++) {
        setRenderFlag(!renderFlag);
        let element = gridBoardCells.current[rowIndex][colIndex];
        if (element.isStartPoint || element.isEndPoint) continue;
        element.isWall =
          colIndex === 0 ||
          colIndex === 49 ||
          rowIndex === 0 ||
          rowIndex === 29 ||
          (rowIndex <= 10 && colIndex % 5 === 0) ||
          (rowIndex > 12 &&
            rowIndex <= 15 &&
            colIndex % 3 === 1 &&
            colIndex !== 1) ||
          (rowIndex >= 18 && colIndex % 5 === 0);
      }
    }
  };

  const generateHorizontalMaze = () => {
    for (let colIndex = 0; colIndex < 50; colIndex++) {
      for (let rowIndex = 0; rowIndex < 30; rowIndex++) {
        setRenderFlag(!renderFlag);
        let element = gridBoardCells.current[rowIndex][colIndex];
        if (element.isStartPoint || element.isEndPoint) continue;
        element.isWall =
          rowIndex === 0 ||
          rowIndex === 29 ||
          colIndex === 0 ||
          colIndex === 49 ||
          (colIndex <= 18 && rowIndex % 5 === 0) ||
          (colIndex > 20 && colIndex <= 28 && rowIndex % 5 === 0) ||
          (colIndex >= 31 && rowIndex % 5 === 0) ||
          (rowIndex > 0 &&
            rowIndex <= 2 &&
            colIndex % 3 === 1 &&
            colIndex !== 1) ||
          (rowIndex > 26 && colIndex % 3 === 1 && colIndex !== 1);
      }
    }
  };

  const generateRandomMaze = () => {
    for (let colIndex = 0; colIndex < 50; colIndex++) {
      for (let rowIndex = 0; rowIndex < 30; rowIndex++) {
        setRenderFlag(!renderFlag);
        let element = gridBoardCells.current[rowIndex][colIndex];
        if (element.isStartPoint || element.isEndPoint) continue;
        element.isWall =
          colIndex % Math.ceil(Math.random() * 2) === 1 ||
          rowIndex % Math.ceil(Math.random() * 2) === 1;
      }
    }
  };

  const animateDijkstra = (visitedCells: CellInterface[]) => {
    for (let i = 0; i < visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " cell-visited";
        if (i >= visitedCells.length - 1) {
          setFoundPath(true);
        }
      }, 10 * i);
    }
  };

  const animatePath = (shortestPath: CellInterface[]) => {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const cell = shortestPath[i];
        setCellsTraveled(i + 1);
        let item = document.getElementById(`cell-${cell.row}-${cell.col}`);
        item!.className += " !bg-red-600";
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
      <div className="flex gap-6">
        <button onClick={visualizeDijkstra}>Visualize dijkstra</button>
        <br />
        <button onClick={generateVerticalMaze}>Generate vertical maze</button>
        <br />
        <button onClick={generateHorizontalMaze}>
          Generate horizontal maze
        </button>
        <br />
        <button onClick={generateRandomMaze}>Generate random maze</button>
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
