"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { fetchTodos, createTodo, updateTodoStatus, deleteTodo } from '@/utils/api';

interface Todo {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  documentId?: string;
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainTask, setMainTask] = useState<Todo[]>([]);
  const [completedTask, setCompletedTask] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get auth data
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      router.push('/signin');
    } else {
      loadTodos();
    }
  }, [token]);

  const loadTodos = async () => {
    if (!token || !user?.id) return;
    setLoading(true);
    const data = await fetchTodos(token, user.id);

    if (data.data) {
      const pending = data.data.filter((todo: any) => !todo.isCompleted);
      const completed = data.data.filter((todo: any) => todo.isCompleted);
      setMainTask(pending);
      setCompletedTask(completed);
    }
    setLoading(false);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const data = await createTodo(token!, title, description, user.id);
      if (data.data) {
        setTitle('');
        setDescription('');
        await loadTodos();
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Session expired or unauthorized. Please log out and log in again.");
    }
  };

  const deleteHandler = async (todo: Todo) => {
    try {
      const identifier = todo.documentId || todo.id.toString();
      await deleteTodo(token!, identifier);
      await loadTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const completeHandler = async (todo: Todo) => {
    try {
      const identifier = todo.documentId || todo.id.toString();
      await updateTodoStatus(token!, identifier, true);
      await loadTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  let renderTask: React.ReactNode = <h2 className="text-center text-zinc-500 italic py-10 text-xl"> No tasks pending. You're all caught up! </h2>

  if (mainTask.length > 0) {
    renderTask = mainTask.map((t: Todo, i: number) => {
      return (
        <li key={t.id} className="bg-zinc-900 border border-zinc-800 shadow-sm hover:border-zinc-700 transition-colors rounded-xl p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center w-full gap-5">
          <div className="flex items-center justify-center bg-zinc-800 text-zinc-400 font-semibold text-lg rounded-full w-12 h-12 shrink-0 border border-zinc-700">
            {i + 1}
          </div>
          <div className="flex flex-col flex-1 w-full text-left">
            <h5 className="text-xl font-bold text-zinc-100 tracking-tight">{t.title}</h5>
            <p className="text-sm font-medium text-zinc-400">{t.description}</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20" onClick={() => completeHandler(t)}>Complete</button>
            <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-all bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20" onClick={() => deleteHandler(t)}>Delete</button>
          </div>
        </li>
      );
    });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <button onClick={() => {
            localStorage.clear();
            window.location.href = '/signin';
          }} className="text-zinc-400 hover:text-white text-sm px-4 py-2 bg-zinc-800 rounded-md">Logout</button>
        </div>

        <h1 className="text-5xl text-center mb-10 font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Todo List</h1>

        <form onSubmit={submitHandler} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Add a new task"
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter description"
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 w-full sm:w-80 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-zinc-100 placeholder-zinc-500 shadow-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-md shadow-indigo-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-indigo-600">
            Add Task
          </button>
        </form>

        {loading ? (
          <div className="text-center py-10">Loading todos...</div>
        ) : (
          <>
            <div className="mb-12">
              <ul className="space-y-4">
                {renderTask}
              </ul>
            </div>

            <div className="pt-8 border-t border-zinc-800/80">
              <h4 className='text-xl font-semibold mb-6 text-zinc-400'>Completed Tasks</h4>
              <ul className="space-y-3">
                {completedTask.map((t: Todo, i: number) => {
                  return (
                    <li key={t.id} className="flex flex-row bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 items-center gap-5 opacity-75 grayscale-[20%]">
                      <div className="flex items-center justify-center bg-zinc-900/80 text-zinc-600 font-medium text-md rounded-full w-10 h-10 shrink-0 border border-zinc-800/80">
                        {i + 1}
                      </div>
                      <div className="flex flex-col flex-1 text-left">
                        <h5 className="text-lg font-semibold text-zinc-500 line-through">{t.title}</h5>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}