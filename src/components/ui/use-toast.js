
import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 10000

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
      } else {
        return {
          ...state,
          toasts: [],
        }
      }
    default:
      return state
  }
}

const listeners = []

let memoryState = { toasts: [] }

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast(props) {
  const id = new Date().getTime().toString()

  const update = (props) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  React.useEffect(() => {
    const timers = new Map()

    state.toasts.forEach((t) => {
      if (t.open) {
         const timeout = t.duration || TOAST_REMOVE_DELAY;
         timers.set(t.id, setTimeout(() => {
            dispatch({ type: "DISMISS_TOAST", toastId: t.id })
          }, timeout))
      }
    })
    
    const timeouts = state.toasts.map((toast) => {
      if (toast.open) {
        const duration = toast.duration || TOAST_REMOVE_DELAY;
        return setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: toast.id });

          setTimeout(() => {
            dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
          }, 1000);

        }, duration);
      }
      return null;
    });

    return () => {
      timeouts.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    }
  }, [state.toasts])

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
