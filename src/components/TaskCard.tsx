import { Id, Task } from "../types";
import DeleteIcons from "../icons/DeleteIcon";
import { useState } from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

const TaskCard = ({ task, deleteTask }: Props) => {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 
      hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      key={task.id}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
    >
      {task.content}
      {mouseOver ? (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded-md
        opacity-60 hover:opacity-100"
        >
          <DeleteIcons />
        </button>
      ) : null}
    </div>
  );
};

export default TaskCard;
