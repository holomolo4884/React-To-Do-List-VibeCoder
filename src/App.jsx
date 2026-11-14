import { useState } from 'react'
import TaskInput from './components/TaskInput.jsx'
import TaskList from './components/TaskList.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'

const STORAGE_KEY = 'todo-list-tasks'
const EMPTY_TASKS = []

function isTaskList(value) {
  if (!Array.isArray(value)) return false

  const ids = new Set()
  return value.every((task) => {
    if (
      !task ||
      typeof task.id !== 'string' ||
      typeof task.text !== 'string' ||
      !task.text.trim() ||
      typeof task.completed !== 'boolean' ||
      ids.has(task.id)
    ) return false

    ids.add(task.id)
    return true
  })
}

export default function App() {
  const [tasks, setTasks, storageError] = useLocalStorage(STORAGE_KEY, EMPTY_TASKS, isTaskList)
  const [announcement, setAnnouncement] = useState('')
  const completedCount = tasks.filter((task) => task.completed).length

  function addTask(text) {
    setTasks((currentTasks) => [
      ...currentTasks,
      { id: crypto.randomUUID(), text, completed: false },
    ])
    setAnnouncement(`Добавлена задача: ${text}`)
  }

  function toggleTask(taskId) {
    const task = tasks.find((item) => item.id === taskId)
    if (task) {
      setAnnouncement(`${task.text}: ${task.completed ? 'снова активна' : 'выполнена'}`)
    }
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId)
    if (task) setAnnouncement(`Удалена задача: ${task.text}`)
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  return (
    <main className="page-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <div className="card-accent" aria-hidden="true" />
        <header className="todo-header">
          <div className="eyebrow"><span /> ПРОСТРАНСТВО ДЛЯ ВАЖНОГО</div>
          <h1 id="page-title">Мои задачи<span>.</span></h1>
          <p className="todo-subtitle">Маленькие шаги приводят к большим результатам.</p>
        </header>

        <TaskInput onAddTask={addTask} />

        <div className="list-heading">
          <h2>На сегодня</h2>
          {tasks.length > 0 && (
            <span className="task-count">
              {completedCount} из {tasks.length} готово
            </span>
          )}
        </div>

        <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>

        {storageError && (
          <p className="storage-notice" role="status">
            Не удалось сохранить список. Изменения могут пропасть после обновления страницы.
          </p>
        )}

        <footer className="todo-footer">
          <span className="footer-sparkle" aria-hidden="true">✳</span>
          <span>Один шаг за раз</span>
        </footer>
      </section>
      <p className="page-note">Ваш список хранится только на этом устройстве</p>
    </main>
  )
}
