function assert(value: boolean, message?: string): asserts value
function assert<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T
function assert(value: any, message?: string) {
  if (value === false || value === null || typeof value === "undefined") {
    throw err(message || "Assertion failed")
  }
}

function err(message: string): Error {
  const error = new Error(message)
  // In V8, Error objects keep the closure scope chain alive until the
  // err.stack property is accessed.
  if (error.stack === undefined) {
    // IE sets the stack only if error is thrown
    try {
      throw error
    } catch {}
  }
  return error
}

export { assert }
