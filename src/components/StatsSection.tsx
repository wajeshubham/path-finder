import React, { SVGProps } from "react";

const StatsSection: React.FC<{
  stats: {
    name: string;
    icon: (
      props: React.ComponentProps<"svg"> & {
        title?: string;
        titleId?: string;
      }
    ) => JSX.Element;
    data: string;
  }[];
}> = ({ stats }) => {
  return (
    <ul
      role="list"
      className="m-4 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 w-full"
    >
      {stats.map((stat) => (
        <li key={stat.name} className="col-span-1 flex rounded-md shadow-sm">
          <div
            className={
              "flex-shrink-0 flex items-center justify-center w-12 text-white text-2xl font-medium rounded-l-md bg-pink-600"
            }
          >
            <stat.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
            <div className="flex-1 truncate px-4 py-2 text-sm">
              <button className="font-medium text-gray-900 hover:text-gray-600">
                {stat.name}
              </button>
              <p className="text-gray-900">{stat.data}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default StatsSection;
