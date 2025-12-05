'use client';

import React, { useState } from "react";

import Canvas from "@/src/components/canvas";
import type { Metadata } from "next";
import TodoList from "@/src/components/todoList";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "My Dashboard Page",
// };

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("canvas");

  return (
    <div>
      <ul className="flex flex-wrap text-sm font-medium text-center text-body border-b dark:bg-blend-darken border-gray-200 dark:border-gray-700">
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
            Todo List(Storage)
          </button>
        </li>
      </ul>
      {activeTab === "canvas" && <Canvas />}
      {activeTab === "todo" && <TodoList />}
    </div>
  );
}