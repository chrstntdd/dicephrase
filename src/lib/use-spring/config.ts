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
  cfg: Config
): InstanceConfig {
  return {
    X: target,
    k: cfg.stiffness ?? 170,
    c: cfg.damping ?? 26,
    m: cfg.mass ?? 1,
    teleport: cfg.teleport ?? false,
    decimals: cfg.decimals ?? 2
  }
}

function getInitialState(target: number, cfg: Config) {
  return {
    x0: cfg.from ?? target,
    v0: cfg.initialSpeed ?? 0,
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
