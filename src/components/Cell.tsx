import React, { HTMLAttributes } from "react";
import { CellInterface } from "../interfaces";

const Cell: React.FC<CellInterface & HTMLAttributes<HTMLDivElement>> = ({
  isStartPoint,
  isEndPoint,
  isWall,
  cellNumber,
  col,
  isVisited,
  row,
  previousCell,
  distanceFromStart,
  timeStamp,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`w-6 h-6 inline-block aspect-square border-[0.1px] border-gray-300 ${
        isStartPoint ? "!bg-red-500" : ""
      } ${isEndPoint ? "!bg-green-500" : ""} ${
        isWall ? "bg-gray-900 wall-animate" : ""
      }`}
    ></div>
  );
};

export default Cell;
