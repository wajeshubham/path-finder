import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { AlgorithmOption, SearchingAlgoEnum } from "../interfaces";
import { classNames } from "../utils/helpers";

const AlgoSelect: React.FC<{
  selectedAlgo: AlgorithmOption | null;
  onSelect: (algo: AlgorithmOption) => void;
}> = ({ selectedAlgo, onSelect }) => {
  return (
    <Listbox
      value={selectedAlgo}
      onChange={(value) => {
        if (!value) return;
        onSelect(value);
      }}
    >
      {({ open }) => (
        <>
          <div className="relative mt-1 ml-4 md:ml-0 flex min-w-[350px] justify-start items-center gap-4">
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
                        active ? "text-white bg-indigo-600" : "text-gray-900",
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
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
  );
};

export default AlgoSelect;
