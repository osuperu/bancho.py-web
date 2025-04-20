export enum GameMode {
  Standard = 0,
  Taiko = 1,
  Catch = 2,
  Mania = 3,
  StandardRelax = 4,
  TaikoRelax = 5,
  CatchRelax = 6,
  StandardAutopilot = 8,
}

export enum RelaxMode {
  Vanilla = 0,
  Relax = 1,
  Autopilot = 2,
}

export const isRealGameMode = (gameMode: GameMode, relaxMode: RelaxMode) => {
  if (relaxMode === RelaxMode.Vanilla) {
    // all game modes are allowed for vanilla
    return true
  } else if (relaxMode === RelaxMode.Relax) {
    // only standard, taiko, and catch are allowed for relax
    return (
      gameMode === GameMode.Standard ||
      gameMode === GameMode.Taiko ||
      gameMode === GameMode.Catch
    )
  } else {
    // (relaxMode === RelaxMode.Autopilot) {
    // only standard is allowed for autopilot
    return gameMode === GameMode.Standard
  }
}

export const mapToBpyMode = (
  gameMode: GameMode,
  relaxMode: RelaxMode
): number => {
  if (relaxMode === RelaxMode.Vanilla) {
    return gameMode
  }
  if (relaxMode === RelaxMode.Relax) {
    if (gameMode >= 0 && gameMode <= 2) return gameMode + 4
  }
  if (relaxMode === RelaxMode.Autopilot) {
    if (gameMode === GameMode.Standard) return 8
  }
  throw new Error("Invalid combination of gameMode and relaxMode")
}

export const gameModeType = (gameMode: GameMode): string => {
  if (
    gameMode === GameMode.Standard ||
    gameMode === GameMode.Taiko ||
    gameMode === GameMode.Catch ||
    gameMode === GameMode.Mania
  )
    return "vanilla"

  if (
    gameMode === GameMode.StandardRelax ||
    gameMode === GameMode.TaikoRelax ||
    gameMode === GameMode.CatchRelax
  )
    return "relax"

  if (gameMode === GameMode.StandardAutopilot) return "autopilot"

  throw new Error("Invalid game mode")
}

// Haz un metodo que devuelve si es standard, taiko, catch, mania
// sin importar si es relax o autopilot
// que devuelva el enum GameMode y no string
export const getOriginalGameMode = (gameMode: GameMode): GameMode => {
  if (
    gameMode === GameMode.Standard ||
    gameMode === GameMode.StandardRelax ||
    gameMode === GameMode.StandardAutopilot
  )
    return GameMode.Standard
  if (gameMode === GameMode.Taiko || gameMode === GameMode.TaikoRelax)
    return GameMode.Taiko
  if (gameMode === GameMode.Catch || gameMode === GameMode.CatchRelax)
    return GameMode.Catch
  if (gameMode === GameMode.Mania) return GameMode.Mania
  throw new Error("Invalid game mode")
}
