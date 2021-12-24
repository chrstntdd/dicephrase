import { readdir, readdirSync, stat, statSync } from "fs"
import { resolve } from "path"
import { promisify } from "util"

let asyncReadDir = promisify(readdir)
let asyncStat = promisify(stat)

const readDirOpts = { withFileTypes: true }

let _filter = (fileName, predicate) =>
  typeof predicate === "function" ? predicate(fileName) : true

/**
 * @description
 * Asynchronously iterate through the file system using a depth-first search
 */
async function* walk(
  rootDir = ".",
  {
    filter,
    includeDirs = true,
    includeFiles = true,
    maxDepth = Infinity,
    onError
  } = {}
) {
  if (maxDepth < 0) return

  if (includeDirs && _filter(rootDir, filter)) {
    yield { name: rootDir, data: await asyncStat(rootDir) }
  }

  if (maxDepth < 1 && !_filter(rootDir, filter)) return

  let dirContents = []

  try {
    dirContents = await asyncReadDir(rootDir, readDirOpts)
  } catch (error) {
    onError?.(error)
  }

  for (let directoryEntry of dirContents) {
    let fullPath = resolve(rootDir, directoryEntry.name)

    if (directoryEntry.isFile()) {
      if (includeFiles && _filter(fullPath, filter)) {
        yield { name: fullPath, data: directoryEntry }
      }
    } else if (directoryEntry.isDirectory()) {
      yield* walk(fullPath, {
        filter,
        includeDirs,
        includeFiles,
        maxDepth: maxDepth - 1,
        onError
      })
    }
  }
}

/**
 * @description
 * Synchronously iterate through the file system using a
 * depth-first search and match on files.
 *
 * Faster for scripting - use the async counterpart when
 * in a server context.
 */
function* walkSync(
  rootDir = ".",
  {
    filter,
    includeDirs = true,
    includeFiles = true,
    maxDepth = Infinity,
    onError
  } = {}
) {
  if (maxDepth < 0) return

  if (includeDirs && _filter(rootDir, filter)) {
    yield { name: rootDir, data: statSync(rootDir) }
  }

  if (maxDepth < 1 && !_filter(rootDir, filter)) return

  let dirContents = []

  try {
    dirContents = readdirSync(rootDir, readDirOpts)
  } catch (error) {
    onError?.(error)
  }

  for (let directoryEntry of dirContents) {
    let fullPath = resolve(rootDir, directoryEntry.name)

    if (directoryEntry.isFile()) {
      if (includeFiles && _filter(fullPath, filter)) {
        yield { name: fullPath, data: directoryEntry }
      }
    } else if (directoryEntry.isDirectory()) {
      yield* walkSync(fullPath, {
        filter,
        includeDirs,
        includeFiles,
        maxDepth: maxDepth - 1,
        onError
      })
    }
  }
}

export { walk, walkSync }
