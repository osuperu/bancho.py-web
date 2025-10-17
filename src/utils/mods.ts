export enum Mods {
  Nomod = 0,
  NoFail = 1 << 0,
  Easy = 1 << 1,
  TouchScreen = 1 << 2, //old: 'NoVideo'
  Hidden = 1 << 3,
  HardRock = 1 << 4,
  SuddenDeath = 1 << 5,
  DoubleTime = 1 << 6,
  Relax = 1 << 7,
  HalfTime = 1 << 8,
  NightCore = 1 << 9,
  Flashlight = 1 << 10,
  AutoPlay = 1 << 11,
  SpunOut = 1 << 12,
  AutoPilot = 1 << 13,
  Perfect = 1 << 14,
  Key4 = 1 << 15,
  Key5 = 1 << 16,
  Key6 = 1 << 17,
  Key7 = 1 << 18,
  Key8 = 1 << 19,
  FadeIn = 1 << 20,
  Random = 1 << 21,
  Cinema = 1 << 22,
  Target = 1 << 23,
  Key9 = 1 << 24,
  KeyCoop = 1 << 25,
  Key1 = 1 << 26,
  Key3 = 1 << 27,
  Key2 = 1 << 28,
  ScoreV2 = 1 << 29,
  Mirror = 1 << 30,
}

enum ModAbbreviations {
  Nomod = '',
  NoFail = 'NF',
  Easy = 'EZ',
  TouchScreen = 'TD',
  Hidden = 'HD',
  HardRock = 'HR',
  SuddenDeath = 'SD',
  DoubleTime = 'DT',
  Relax = 'RX',
  HalfTime = 'HT',
  NightCore = 'NC',
  Flashlight = 'FL',
  AutoPlay = 'AU',
  SpunOut = 'SO',
  AutoPilot = 'AP',
  Perfect = 'PF',
  Key4 = '4K',
  Key5 = '5K',
  Key6 = '6K',
  Key7 = '7K',
  Key8 = '8K',
  FadeIn = 'FI',
  Random = 'RN',
  Cinema = 'CN',
  Target = 'TP',
  Key9 = '9K',
  KeyCoop = 'DS', // dual stages
  Key1 = '1K',
  Key3 = '3K',
  Key2 = '2K',
  ScoreV2 = 'V2',
  Mirror = 'MR',
}

export const getIndividualMods = (mods: number): Mods[] => {
  return Object.values(Mods)
    .filter((x) => typeof x !== 'string')
    .map((mod) => mod as Mods)
    .filter((mod) => mods & mod);
};

export const formatMods = (mods: number): string => {
  const activeMods: string[] = getIndividualMods(mods).map(
    (mod) => ModAbbreviations[Mods[mod]],
  );

  return activeMods.join('');
};
