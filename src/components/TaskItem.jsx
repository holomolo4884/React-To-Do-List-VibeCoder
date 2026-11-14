export default function TaskItem({ task, index, onToggle, onDelete }) {
  const checkboxId = `task-${task.id}`

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`} style={{ '--item-index': index }}>
      <input
        id={checkboxId}
        className="task-item__checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
      />
      <label className="task-item__text" htmlFor={checkboxId}>
        {task.text}
      </label>
      <button
        className="delete-button"
        type="button"
        onClick={onDelete}
        aria-label={`Удалить задачу: ${task.text}`}
        title="Удалить задачу"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4.5 6h11M8 6V4.5h4V6m2.5 0-.6 9H6.1l-.6-9m3 2.5v4m3-4v4" />
        </svg>
      </button>
    </li>
  )
}
