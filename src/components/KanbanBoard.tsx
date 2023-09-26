import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  // CreateNewColumn
  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  };

  // CreateTask

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  // DeleteColumn
  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  // updateColumn
  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  // OnDragStart
  const onDragStart = (e: DragStartEvent) => {
    console.log("Dragged", e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
  };

  // OnDragEnd
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  const generateId = () => {
    return Math.floor(Math.random() * 100001);
  };
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="h-[60px] w-[350px] min-w-[350px] flex items-center justify-center gap-x-3 cursor-pointer rounded-lg bg-mainBackgroundColor
        border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
          >
            <PlusIcon /> Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
