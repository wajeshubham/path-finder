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
  previousNode,
  distanceFromStart,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`w-6 h-6 inline-block aspect-square border-[0.1px] border-emerald-500 ${
        isStartPoint ? "bg-red-500" : ""
      } ${isEndPoint ? "bg-green-500" : ""} ${isWall ? "bg-gray-900" : ""}`}
    ></div>
  );
};

export default Cell;
