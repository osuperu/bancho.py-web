import { GameMode } from "./GameModes"

export const getGradeColor = (grade: string, alpha = 1.0) => {
  let colorCode = "#000000"
  if (grade === "XH") {
    colorCode = "#e6e6e6"
  } else if (grade === "X") {
    colorCode = "#ebcc5e"
  } else if (grade === "SH") {
    colorCode = "#e6e6e6"
  } else if (grade === "S") {
    colorCode = "#ebcc5e"
  } else if (grade === "A") {
    colorCode = "#8ef97d"
  } else if (grade === "B") {
    colorCode = "#99e4ff"
  } else if (grade === "C") {
    colorCode = "#e69cff"
  } else if (grade === "D" || grade === "F") {
    colorCode = "#ffa49c"
  }
  const alphaHex = (alpha * 255).toString(16).padEnd(2, "0")
  return colorCode + alphaHex
}

export const remapSSForDisplay = (grade: string): string => {
  switch (grade) {
    case "XH":
    case "X":
      return "SS"
    case "SH":
    case "S":
      return "S"
    default:
      return grade
  }
}

export const calculateGrade = (
  gameMode: GameMode,
  mods: number, // TODO: enum
  acc: number,
  num_300s: number,
  num_100s: number,
  num_50s: number,
  num_misses: number
) => {
  const objectCount = num_300s + num_100s + num_50s + num_misses

  // Hidden | Flashlight | FadeIn
  const shouldUseSilverGrades = (mods & 1049608) > 0 // TODO: enum

  switch (gameMode) {
    case GameMode.Standard:
    case GameMode.StandardRelax:
    case GameMode.StandardAutopilot:
    case GameMode.Taiko:
    case GameMode.TaikoRelax:
      const ratio300 = num_300s / objectCount
      const ratio50 = num_50s / objectCount

      if (ratio300 === 1) {
        return shouldUseSilverGrades ? "XH" : "X"
      }

      if (ratio300 > 0.9 && ratio50 <= 0.01 && num_misses === 0) {
        return shouldUseSilverGrades ? "SH" : "S"
      }
      if ((ratio300 > 0.8 && num_misses === 0) || ratio300 > 0.9) {
        return "A"
      }
      if ((ratio300 > 0.7 && num_misses === 0) || ratio300 > 0.8) {
        return "B"
      }
      if (ratio300 > 0.6) {
        return "C"
      }
      return "D"

    case GameMode.Catch:
    case GameMode.CatchRelax:
      if (acc === 100) {
        return shouldUseSilverGrades ? "XH" : "X"
      }
      if (acc > 98) {
        return shouldUseSilverGrades ? "SH" : "S"
      }
      if (acc > 94) {
        return "A"
      }
      if (acc > 90) {
        return "B"
      }
      if (acc > 85) {
        return "C"
      }
      return "D"

    case GameMode.Mania:
      if (acc === 100) {
        return shouldUseSilverGrades ? "XH" : "X"
      }
      if (acc > 95) {
        return shouldUseSilverGrades ? "SH" : "S"
      }
      if (acc > 90) {
        return "A"
      }
      if (acc > 80) {
        return "B"
      }
      if (acc > 70) {
        return "C"
      }
      return "D"
  }
}

export const modeToStatsIndex = (
  mode: GameMode
):
  | "std"
  | "taiko"
  | "ctb"
  | "mania"
  | "rx!std"
  | "rx!taiko"
  | "rx!ctb"
  | "ap!std" => {
  switch (mode) {
    case GameMode.Standard:
      return "std"
    case GameMode.Taiko:
      return "taiko"
    case GameMode.Catch:
      return "ctb"
    case GameMode.Mania:
      return "mania"
    case GameMode.StandardRelax:
      return "rx!std"
    case GameMode.TaikoRelax:
      return "rx!taiko"
    case GameMode.CatchRelax:
      return "rx!ctb"
    case GameMode.StandardAutopilot:
      return "ap!std"
  }
  return "std"
}
