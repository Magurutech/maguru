/**
 * Shared difficulty color mapping for course badges.
 * Single source of truth — used by CourseCard, CourseOverviewHero, CourseListItem.
 */

export const DIFFICULTY_COLORS: Record<string, string> = {
  Pemula: 'bg-hijau-100 text-hijau-700 border-hijau-200',
  Menengah: 'bg-kuning-100 text-kuning-700 border-kuning-200',
  Mahir: 'bg-merah-100 text-merah-700 border-merah-200',
}

export const DEFAULT_DIFFICULTY_COLOR = 'bg-beige-100 text-beige-700 border-beige-200'

/**
 * Returns the Tailwind class string for a given difficulty level.
 */
export function getDifficultyClass(difficulty: string | null | undefined): string {
  if (difficulty && DIFFICULTY_COLORS[difficulty]) {
    return DIFFICULTY_COLORS[difficulty]
  }
  return DEFAULT_DIFFICULTY_COLOR
}
