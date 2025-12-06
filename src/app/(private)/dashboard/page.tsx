'use client';

import React, { useState } from "react";

import Avatar from "@/src/components/avatar";
import Canvas from "@/src/components/canvas";
import TodoList from "@/src/components/todoList";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("canvas");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <ul className="flex text-sm font-medium text-center text-body">
          <li>
            <button
              onClick={() => setActiveTab("canvas")}
              className={`inline-block p-4 rounded-t-base cursor-pointer ${activeTab === "canvas"
                  ? "text-fg-brand bg-neutral-secondary-soft active"
                  : "hover:text-heading hover:bg-neutral-secondary-soft"
                }`}
            >
              Realtime Canvas
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("todo")}
              className={`inline-block p-4 rounded-t-base cursor-pointer ${activeTab === "todo"
                  ? "text-fg-brand bg-neutral-secondary-soft active"
                  : "hover:text-heading hover:bg-neutral-secondary-soft"
                }`}
            >
              Todo List (Storage)
            </button>
          </li>
        </ul>

        {/* Avatar on the right */}
        <div className="px-4">
          <Avatar />
        </div>
      </div>

      {/* Content */}
      {activeTab === "canvas" && <Canvas />}
      {activeTab === "todo" && <TodoList />}
    </div>
  );
}
