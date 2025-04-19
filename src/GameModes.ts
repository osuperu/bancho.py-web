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
