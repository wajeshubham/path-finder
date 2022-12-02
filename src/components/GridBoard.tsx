import React, { useState } from "react";
import { CellInterface } from "../interfaces";
import { getCellObjects } from "../utils/helpers";
import Cell from "./Cell";
import { produce } from "immer";
import { dijkstra } from "../app/dijkstra";

const GridBoard = () => {
  const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [gridBoardCells, setGridBoardCells] =
    useState<CellInterface[][]>(getCellObjects);

  const visualizeDijkstra = () => {
    if (!startPoint || !endPoint) return;
    let grid = [...gridBoardCells];
    let visitedCells = dijkstra(grid, grid[startPoint.row][endPoint.col]) || [];
    for (let i = 0; i <= visitedCells.length; i++) {
      setTimeout(() => {
        const cell = visitedCells[i];
        document.getElementById(`cell-${cell.row}-${cell.col}`)!.className +=
          " cell-visited";
      }, 10 * i);
    }
  };

  return (
    <>
      <button onClick={visualizeDijkstra}>Visualize</button>
      <div className="grid mt-20 grid-cols-gridmap justify-center items-center">
        {gridBoardCells.map((row, rowIndex) => {
          return (
            <>
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
                      if (!isMouseDown) return;
                      setGridBoardCells(
                        produce((draft) => {
                          if (
                            draft[rowIndex][colIndex].isStartPoint ||
                            draft[rowIndex][colIndex].isEndPoint
                          )
                            return;
                          draft[rowIndex][colIndex].isWall =
                            !draft[rowIndex][colIndex].isWall;
                        })
                      );
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                    onClick={() => {
                      let clickedCell = gridBoardCells[rowIndex][colIndex];
                      if (cell.cellNumber === startPoint?.cellNumber) {
                        setGridBoardCells(
                          produce((draft) => {
                            setStartPoint(null);
                            draft[rowIndex][colIndex].isStartPoint = false;
                            draft[rowIndex][colIndex].distanceFromStart =
                              Infinity;
                          })
                        );
                        return;
                      }
                      if (cell.cellNumber === endPoint?.cellNumber) {
                        setGridBoardCells(
                          produce((draft) => {
                            setEndPoint(null);
                            draft[rowIndex][colIndex].isEndPoint = false;
                          })
                        );
                        return;
                      }

                      if (startPoint && endPoint) return;
                      setGridBoardCells(
                        produce((draft) => {
                          if (!startPoint) {
                            setStartPoint({
                              ...clickedCell,
                              isStartPoint: true,
                              distanceFromStart: 0,
                            });
                            draft[rowIndex][colIndex].isStartPoint = true;
                            draft[rowIndex][colIndex].distanceFromStart = 0;
                          } else if (startPoint) {
                            setEndPoint({
                              ...clickedCell,
                              isEndPoint: true,
                            });
                            draft[rowIndex][colIndex].isEndPoint = true;
                          }
                        })
                      );
                    }}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </>
  );
};

export default GridBoard;
