"use client";

import { FormEvent, useEffect, useState } from "react";

// Type for a single task
type TaskType = {
  task: string;
  description: string;
  isDone: boolean;
  isEditing: boolean;
};

const Page = () => {
  const [task, setTask] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [mainTask, setMainTask] = useState<TaskType[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setMainTask(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage on change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!task.trim() || !description.trim()) return;

    setMainTask((prev) => [
      ...prev,
      {
        task,
        description,
        isDone: false,
        isEditing: false,
      },
    ]);

    setTask("");
    setDescription("");
  };

  const deleteHandler = (index: number) => {
    const copyTask = [...mainTask];
    copyTask.splice(index, 1);
    setMainTask(copyTask);
  };

  const toggleDone = (index: number) => {
    const copy = [...mainTask];
    copy[index].isDone = !copy[index].isDone;
    setMainTask(copy);
  };

  const toggleEdit = (index: number) => {
    const copy = [...mainTask];
    copy[index].isEditing = !copy[index].isEditing;
    setMainTask(copy);
  };

  const handleEditChange = (
    index: number,
    field: "task" | "description",
    value: string
  ) => {
    const copy = [...mainTask];
    copy[index][field] = value;
    setMainTask(copy);
  };

  return (
    <>
      <h1 className="text-black p-5 text-5xl font-bold text-center">
        TODOLIST NEXT.js + TYPESCRIPT
      </h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          className="text-2xl border-zinc-800 border-2 m-5 px-4 py-2"
          placeholder="Enter Task Here"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          className="text-2xl border-zinc-800 border-2 m-5 px-4 py-2"
          placeholder="Enter Description Here"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-3 text-2xl font-bold rounded m-5">
          ADD
        </button>
      </form>

      <hr />

      <div className="p-8 bg-slate-200">
        {mainTask.length < 1 ? (
          <h2>No Task Available</h2>
        ) : (
          mainTask.map((taskItem, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-between w-2/3">
                {taskItem.isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={taskItem.task}
                      onChange={(e) =>
                        handleEditChange(index, "task", e.target.value)
                      }
                      className="text-xl border p-1 mr-2"
                    />
                    <input
                      type="text"
                      value={taskItem.description}
                      onChange={(e) =>
                        handleEditChange(index, "description", e.target.value)
                      }
                      className="text-xl border p-1"
                    />
                  </div>
                ) : (
                  <div>
                    <h5
                      className={`text-2xl font-semibold ${
                        taskItem.isDone ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {taskItem.task}
                    </h5>
                    <p className="text-lg font-medium">
                      {taskItem.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleDone(index)}
                  className="bg-green-300 p-2 rounded border-1"
                >
                  {taskItem.isDone ? "Undone" : "Done"}
                </button>
                <button
                  onClick={() => toggleEdit(index)}
                  className="bg-blue-300 p-2 rounded border-1"
                >
                  {taskItem.isEditing ? "Save" : "Edit"}
                </button>
                <button
                  onClick={() => deleteHandler(index)}
                  className="bg-amber-300 p-2 rounded border-1"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </div>
    </>
  );
};

export default Page;
