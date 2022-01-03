import { Dirent, readdir, readdirSync, stat, Stats, statSync } from "fs"
import { resolve } from "path"
import { promisify } from "util"

const asyncReadDir = promisify(readdir)
const asyncStat = promisify(stat)

interface FileData {
  name: string
  data: Dirent | Stats
}

interface WalkOptions {
  /** Filter yielded results with a predicate */
  filter?: (fileName: string) => boolean
  includeDirs: boolean
  includeFiles: boolean
  /** Limit the how deep the search through the file system goes */
  maxDepth?: number
  /** Handle errors that may be thrown when reading a directory */
  onError?: (err: Error) => void
}

const readDirOpts = { withFileTypes: true } as const

/** @private */
let _filter = (fileName: string, predicate?: (n: string) => boolean): boolean =>
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
  } = {} as WalkOptions
): AsyncIterableIterator<FileData> {
  if (maxDepth < 0) return

  if (includeDirs && _filter(rootDir, filter)) {
    yield { name: rootDir, data: await asyncStat(rootDir) }
  }

  if (maxDepth < 1 && !_filter(rootDir, filter)) return

  let dirContents: ReturnType<typeof readdirSync> = []

  try {
    dirContents = await asyncReadDir(rootDir, readDirOpts)
  } catch (error) {
    typeof onError === "function" && onError(error)
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
  } = {} as WalkOptions
): IterableIterator<FileData> {
  if (maxDepth < 0) return

  if (includeDirs && _filter(rootDir, filter)) {
    yield { name: rootDir, data: statSync(rootDir) }
  }

  if (maxDepth < 1 && !_filter(rootDir, filter)) return

  let dirContents: ReturnType<typeof readdirSync> = []

  try {
    dirContents = readdirSync(rootDir, readDirOpts)
  } catch (error) {
    typeof onError === "function" && onError(error)
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

export type { WalkOptions, FileData }
export { walk, walkSync }
