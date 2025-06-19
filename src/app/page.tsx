"use client";

import { useEffect, useState } from "react";


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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  //dark and light mode
  useEffect(() => {
    const mode = localStorage.getItem("darkMode");
    if (mode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);


  //filter
  const filteredTasks = mainTask.filter((item) => {
    const matchesSearch =
      item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "Complete") return matchesSearch && item.isDone;
    if (filterStatus === "Incomplete") return matchesSearch && !item.isDone;
    return matchesSearch; // All
  });


  //add task 
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);


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

  // const submitHandler = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (!task.trim() || !description.trim()) return;

  //   setMainTask((prev) => [
  //     ...prev,
  //     {
  //       task,
  //       description,
  //       isDone: false,
  //       isEditing: false,
  //     },
  //   ]);
  //   setTask("");
  //   setDescription("");
  // };

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
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <h1 className="p-5 text-2 font-bold text-center dark:text-white">
        TODOLIST
      </h1>

      {/* Search Input */}
      <div className="flex justify-center items-center my-6 gap-2">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search note..."
            className="w-full px-4 py-2 pr-10 border-2 border-purple-300 text-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <img
              src="./search.png"
              alt="Search Icon"
              className="h-5 w-5 opacity-70"
            />
          </span>

        </div>

        {/* Optional filters like ALL or sort buttons */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#F7F7F7] text-purple-600 border border-purple-400 px-4 py-3 rounded-lg text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
        >
          <option value="All" className="text-purple-600">All</option>
          <option value="Complete" className="text-purple-600">Complete</option>
          <option value="Incomplete" className="text-purple-600">Incomplete</option>
        </select>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className={`px-3 py-3 border border-purple-600 rounded-lg text-sm font-semibold transition 
            ${!darkMode ? "bg-purple-500 hover:bg-purple-600" : "bg-transparent hover:bg-gray-700"}`}
        >
          <img
            src={darkMode ? "./light.png" : "./vector_todo.png"}
            alt="Toggle Theme"
            className="h-5 w-5 opacity-70"
          />
        </button>
      </div>

      {/* Task Add Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.70)" }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">NEW NOTE</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
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
                setIsModalOpen(false);
              }}
            >
              <input
                type="text"
                placeholder="Input your note..."
                className="w-full border border-purple-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter description..."
                className="w-full border border-purple-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 mb-6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-purple-400 text-purple-600 hover:bg-purple-50 transition"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                >
                  APPLY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="p-6">
        {filteredTasks.length < 1 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <img
              src="./Detective-check-footprint.png"
              alt="Search Icon"
              className="h-52 w-52 mb-2"
            />
            <p className="text-gray-800">Empty..</p>
          </div>
        ) : (
          <ul className="space-y-4 max-w-xl mx-auto">
            {filteredTasks.map((taskItem, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white rounded-md px-4 py-2 shadow-sm border border-purple-100 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={taskItem.isDone}
                    onChange={() => toggleDone(index)}
                    className="accent-purple-500 w-5 h-5"
                  />
                  {taskItem.isEditing ? (
                    <div className="flex flex-col">
                      <input
                        type="text"
                        value={taskItem.task}
                        onChange={(e) =>
                          handleEditChange(index, "task", e.target.value)
                        }
                        className="text-sm border-b border-purple-300 mb-1 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={taskItem.description}
                        onChange={(e) =>
                          handleEditChange(index, "description", e.target.value)
                        }
                        className="text-xs text-gray-500 border-b border-purple-200 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${taskItem.isDone ? "line-through text-gray-400" : "text-black"
                          }`}
                      >
                        {taskItem.task}
                      </span>
                      {taskItem.description && (
                        <span className="text-xs text-gray-500">
                          {taskItem.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEdit(index)}
                    title={taskItem.isEditing ? "Save" : "Edit"}
                    className="p-1 rounded hover:bg-purple-100 transition"
                  >
                    <img
                      src={taskItem.isEditing ? "/Save_button.png" : "/edit.png"}
                      alt={taskItem.isEditing ? "Save" : "Edit"}
                      className="w-5 h-5"
                    />
                  </button>

                  <button
                    onClick={() => deleteHandler(index)}
                    title="Delete"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <img
                      src="./delete.png"
                      alt="Search Icon"
                      className="h-5 w-5 opacity-70"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white text-2xl w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        title="Add New Task"
      >
        +
      </button>
    </div>
  );
};

export default Page;
