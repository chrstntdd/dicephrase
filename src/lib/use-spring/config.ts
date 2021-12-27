import { TaskId } from "./raf"
import { currentTime } from "./time"

export function useSpringInstance(target: number, config: Config): Instance {
  return {
    config: getConfigWithDefaults(target, config),
    state: getInitialState(target, config)
  }
}

export function getConfigWithDefaults(
  target: number,
  { stiffness, damping, mass, decimals, teleport }: Config
): InstanceConfig {
  return {
    X: target,
    k: stiffness ?? 170,
    c: damping ?? 26,
    m: mass ?? 1,
    teleport: teleport ?? false,
    decimals: decimals ?? 2
  }
}

function getInitialState(target: number, { from, initialSpeed }: Config) {
  return {
    x0: from ?? target,
    v0: initialSpeed ?? 0,
    t0: currentTime(),
    raf: null
  }
}

export type Config = {
  stiffness?: number
  damping?: number
  mass?: number
  decimals?: number
  teleport?: boolean
  initialSpeed?: number
  from?: number
}

type Instance = {
  config: InstanceConfig
  state: InstanceState
}

export type InstanceConfig = {
  X: number
  k: number
  c: number
  m: number
  teleport: boolean
  decimals: number
}

type InstanceState = {
  x0: number
  v0: number
  t0: number
  raf: TaskId | null
}
