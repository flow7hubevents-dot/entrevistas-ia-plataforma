export const MOODS = [
    "somnoliento",
    "enfadado",
    "escéptico",
    "impaciente",
    "curioso",
    "empático",
    "sarcástico",
    "aburrido",
    "alegre",
    "estresado",
    "triste",
    "exigente",
    "distraído",
    "autoritario",
    "tímido",
] as const;

export type Mood = (typeof MOODS)[number];

export function getRandomMoods(): Mood[] {
    const shuffled = [...MOODS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
}
