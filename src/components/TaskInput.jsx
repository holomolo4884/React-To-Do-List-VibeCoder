import { useRef, useState } from 'react'

export default function TaskInput({ onAddTask }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedText = text.trim()

    if (!trimmedText) return

    onAddTask(trimmedText)
    setText('')
    inputRef.current?.focus()
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="new-task">
        Новая задача
      </label>
      <input
        ref={inputRef}
        id="new-task"
        className="task-form__input"
        type="text"
        placeholder="Например, купить продукты"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoComplete="off"
      />
      <button className="add-button" type="submit" aria-label="Добавить задачу">
        <span aria-hidden="true">+</span>
        <span className="add-button__label">Добавить</span>
      </button>
    </form>
  )
}
