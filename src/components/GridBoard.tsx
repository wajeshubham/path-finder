import React, { Fragment, useEffect, useRef, useState } from "react";
import { CellInterface, SearchingAlgoEnum } from "../interfaces";
import { classNames, getCellObjects, getPath } from "../utils/helpers";
import Cell from "./Cell";
import { dijkstra } from "../app/algorithms/dijkstra";
import { BFS } from "../app/algorithms/BFS";
import { DFS } from "../app/algorithms/DFS";
import { generateRandomMaze } from "../app/maze/randomMaze";
import { InfoSideOver } from "./InfoSideover";
import StatsSection from "./StatsSection";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { generateRecursiveMaze } from "../app/maze/recursiveMaze";

const GridBoard = () => {
  const gridBoardCells = useRef(getCellObjects());

  const [startPoint, setStartPoint] = useState<CellInterface | null>(null);
  const [endPoint, setEndPoint] = useState<CellInterface | null>(null);
  const [foundPath, setFoundPath] = useState<CellInterface[] | null>(null);

  const [cellsScanned, setCellsScanned] = useState(0);
  const [cellsTraveled, setCellsTraveled] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [renderFlag, setRenderFlag] = useState(false);

  const [selectedAlgo, setSelectedAlgo] = useState<{
    name: string;
    type: SearchingAlgoEnum;
    onClick: () => void;
  } | null>(null);
  const [showInfoOf, setShowInfoOf] = useState<SearchingAlgoEnum | null>(null);

  const clearBoard = () => {
    gridBoardCells.current = getCellObjects();
    document.querySelectorAll(`.cell`).forEach((item) => {
      if (item.classList.contains("cell-visited")) {
        item.classList.remove("cell-visited");
      }
      if (item.classList.contains("cell-path")) {
        item.classList.remove("cell-path");
      }
    });
    setStartPoint(null);
    setEndPoint(null);
    setFoundPath(null);
    setCellsScanned(0);
    setCellsTraveled(0);
  };

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
        item!.className += " cell-path";
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
        let [dCells, DTime] = dijkstra(grid, start, end) || [];
        visitedCells = dCells || [];
        setTimeTaken(DTime || 0);
        break;
      case SearchingAlgoEnum.DFS:
        let [DFSCells, DFSTime] = DFS(grid, start, end) || [];
        visitedCells = DFSCells || [];
        setTimeTaken(DFSTime || 0);
        break;
      case SearchingAlgoEnum.BFS:
        let [BFSCells, BFSTime] = BFS(grid, start, end) || [];
        visitedCells = BFSCells || [];
        setTimeTaken(BFSTime || 0);
        break;
    }
    const path = getPath(end);
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
      <InfoSideOver
        algorithm={showInfoOf}
        onClose={() => {
          setShowInfoOf(null);
        }}
      />
      <div className="bg-gray-900 pt-4">
        <div className="mx-auto flex max-w-7xl md:flex-row flex-col items-center justify-between">
          <div className="flex flex-1 items-center w-full justify-start space-x-6 mx-4">
            {/* FIXME: Make select component dynamic */}
            <Listbox
              value={selectedAlgo}
              onChange={(value) => {
                setSelectedAlgo(value);
              }}
            >
              {({ open }) => (
                <>
                  <div className="relative mt-1 flex min-w-[350px] justify-start items-center gap-4">
                    <Listbox.Button className="relative w-full cursor-default border-b-[1px] border-b-gray-400 bg-gray-900 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm">
                      <span
                        className={classNames(
                          selectedAlgo ? "text-white" : "text-gray-400",
                          "block truncate"
                        )}
                      >
                        {selectedAlgo?.name || "Select an algorithm"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute top-0 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {[
                          {
                            name: "Dijkstra's algorithm",
                            type: SearchingAlgoEnum.DIJKSTRA,
                          },
                          {
                            name: "Breadth-first Search",
                            type: SearchingAlgoEnum.BFS,
                          },
                          {
                            name: "Depth-first Search",
                            type: SearchingAlgoEnum.DFS,
                          },
                        ].map((algo) => (
                          <Listbox.Option
                            key={algo.type}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-indigo-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={algo}
                          >
                            {({ active }) => (
                              <>
                                <span
                                  className={classNames(
                                    algo.type === selectedAlgo?.type
                                      ? "font-semibold"
                                      : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {algo.name}
                                </span>

                                {algo.type === selectedAlgo?.type ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-indigo-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
            <button
              disabled={!selectedAlgo}
              onClick={() =>
                selectedAlgo ? visualizeAlgo(selectedAlgo?.type) : null
              }
              className="w-fit disabled:bg-indigo-400 disabled:cursor-not-allowed inline-flex bg-indigo-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              {selectedAlgo
                ? `Visualize ${selectedAlgo?.name}`
                : "Select an algorithm"}
            </button>
            <button
              onClick={() => {
                clearBoard();
                setRenderFlag(!renderFlag);
              }}
              className="w-fit disabled:bg-green-400 disabled:cursor-not-allowed inline-flex bg-green-500 text-[15px] text-white px-4 py-2 rounded-md"
            >
              Clear board
            </button>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-900 ">
        <div className="flex flex-1 pt-4 max-w-7xl items-center justify-start space-x-6 mx-auto">
          <button
            className="w-fit ml-4 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            onClick={() => {
              generateRandomMaze(gridBoardCells.current);
              setRenderFlag(!renderFlag);
            }}
          >
            Generate random maze
          </button>
          <span className="h-6 w-px bg-gray-600" aria-hidden="true" />
          <button
            className="w-fit disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            onClick={() => {
              setRenderFlag(!renderFlag);
              generateRecursiveMaze(gridBoardCells.current);
            }}
          >
            Generate recursive maze (vertical)
          </button>
          <span className="h-6 w-px bg-gray-600" aria-hidden="true" />
          <button
            className="w-fit disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            onClick={() => {
              generateRandomMaze(gridBoardCells.current);
              setRenderFlag(!renderFlag);
            }}
          >
            Generate recursive maze (horizontal)
          </button>
        </div>
      </div>
      <div className="w-full bg-gray-900 ">
        <div className="flex gap-6 justify-center max-w-7xl mx-auto items-center">
          <StatsSection
            stats={[
              {
                name: "Cells scanned",
                icon: MagnifyingGlassIcon,
                data: cellsScanned.toString(),
              },
              {
                name: "Cells traveled",
                icon: PaperAirplaneIcon,
                data: cellsTraveled.toString(),
              },
              {
                name: "Time taken",
                icon: ClockIcon,
                data: `${timeTaken?.toFixed(2)}ms`,
              },
            ]}
          />
        </div>
      </div>
      {selectedAlgo ? (
        <div className="flex my-3 w-full mx-auto justify-end max-w-7xl">
          <button
            className="mx-4 text-indigo-700 font-medium underline"
            onClick={() => {
              setShowInfoOf(selectedAlgo.type);
            }}
          >
            Know more about {selectedAlgo?.name}
          </button>
        </div>
      ) : null}
      <div className="grid grid-cols-gridmap justify-center items-center mt-3">
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
