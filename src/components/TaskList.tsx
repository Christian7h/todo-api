import React from 'react';
import { Check, Trash2 } from 'lucide-react';

const TaskList = ({ tasks, onComplete, onDelete }) => {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task._id}
          className={`p-4 border rounded-lg shadow-sm transition-all ${
            task.completed ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <div className="shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-500 text-sm mt-1">{task.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              {!task.completed && (
                <button
                  onClick={() => onComplete(task._id, !task.completed)}
                  className="text-green-500 hover:bg-green-100 p-2 rounded-full transition-colors"
                  aria-label="Complete Task"
                >
                  <Check />
                </button>
              )}
              <button
                onClick={() => onDelete(task._id)}
                className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                aria-label="Delete Task"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;