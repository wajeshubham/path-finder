import React, { HTMLAttributes } from "react";
import { CellInterface } from "../interfaces";
import { MapPinIcon, TrophyIcon } from "@heroicons/react/24/outline";

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
  isTarget,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`cell lg:w-6 w-4 lg:h-6 h-4 inline-flex justify-center items-center aspect-square border-[0.1px] border-indigo-300 ${
        isStartPoint ? "!bg-green-300" : ""
      } ${isEndPoint ? "!bg-gray-200" : ""} ${
        isWall ? "!bg-gray-900 wall-animate" : ""
      }`}
    >
      {isStartPoint ? (
        <MapPinIcon className="h-4 w-4 font-bold" />
      ) : isEndPoint ? (
        <TrophyIcon className="h-4 w-4 font-bold" />
      ) : null}
    </div>
  );
};

export default Cell;
