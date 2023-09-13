import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column } from "../types";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  console.log(columns);
  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 100001);
  };
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {columns.map((col) => (
            <div>{col.title}</div>
          ))}
        </div>
        <button
          onClick={createNewColumn}
          className="h-[60px] w-[350px] min-w-[350px] flex items-center justify-center gap-x-3 cursor-pointer rounded-lg bg-mainBackgroundColor
        border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
        >
          <PlusIcon /> Add Column
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
