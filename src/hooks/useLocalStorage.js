import { useEffect, useState } from 'react'

function readStoredValue(key, initialValue, isValid) {
  try {
    const storedValue = window.localStorage.getItem(key)
    if (storedValue === null) return { value: initialValue, error: false }

    const parsedValue = JSON.parse(storedValue)
    return isValid(parsedValue)
      ? { value: parsedValue, error: false }
      : { value: initialValue, error: true }
  } catch {
    return { value: initialValue, error: true }
  }
}

// Читаем и проверяем сохранённое значение один раз при создании состояния.
export default function useLocalStorage(key, initialValue, isValid = () => true) {
  const [storedState, setStoredState] = useState(() =>
    readStoredValue(key, initialValue, isValid),
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedState.value))
      setStoredState((current) => current.error ? { ...current, error: false } : current)
    } catch {
      setStoredState((current) => current.error ? current : { ...current, error: true })
    }
  }, [key, storedState.value])

  // Подхватываем изменения этого списка из других вкладок.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== key && event.key !== null) return

      if (event.newValue === null) {
        setStoredState({ value: initialValue, error: false })
        return
      }

      try {
        const parsedValue = JSON.parse(event.newValue)
        if (!isValid(parsedValue)) {
          setStoredState((current) => ({ ...current, error: true }))
          return
        }
        setStoredState({ value: parsedValue, error: false })
      } catch {
        setStoredState((current) => ({ ...current, error: true }))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, initialValue, isValid])

  function setValue(nextValue) {
    setStoredState((current) => ({
      ...current,
      value: typeof nextValue === 'function' ? nextValue(current.value) : nextValue,
    }))
  }

  return [storedState.value, setValue, storedState.error]
}
