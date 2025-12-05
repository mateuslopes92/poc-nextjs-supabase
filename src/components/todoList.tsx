"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

const BUCKET = "todo-bucket";
const FILE = "todos.json";

export default function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const supabase = createClient();


  // --- Load todos on mount ---
  useEffect(() => {
    async function loadTodos() {
      const { data } = await supabase.storage.from(BUCKET).download(FILE);
      if (!data) return;
      console.log(data);

      const text = await data.text();
      setTodos(JSON.parse(text).items || []);
    }

    loadTodos();
  }, [supabase.storage]);

  // --- Save todos to Storage ---
  async function saveTodos(next: string[]) {
    const body = JSON.stringify({ items: next }, null, 2);

    const response = await supabase.storage.from(BUCKET).upload(FILE, body, {
      upsert: true,
      contentType: "application/json",
    });

    console.log("Response", response);

    setTodos(next);
  }

  // --- Add item ---
  async function addTodo() {
    if (!input.trim()) return;
    const next = [...todos, input.trim()];
    await saveTodos(next);
    setInput("");
  }

  // --- Delete item ---
  async function deleteTodo(index: number) {
    const next = todos.filter((_, i) => i !== index);
    await saveTodos(next);
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Storage TODO</h1>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="New task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-3 rounded" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((t, i) => (
          <li key={i} className="flex justify-between items-center border p-2 rounded">
            {t}
            <button
              className="text-red-500"
              onClick={() => deleteTodo(i)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}