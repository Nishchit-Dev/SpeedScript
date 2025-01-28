export function getBadgeImage(wpm: number): string {
    if (wpm >= 0 && wpm <= 9) return 'Badge_01.svg' // Starter
    if (wpm >= 10 && wpm <= 19) return 'Badge_02.svg' // Learner
    if (wpm >= 20 && wpm <= 29) return 'Badge_03.svg' // Rookie
    if (wpm >= 30 && wpm <= 39) return 'Badge_04.svg' // Improver
    if (wpm >= 40 && wpm <= 59) return 'Badge_05.svg' // Proficient
    if (wpm >= 50 && wpm <= 69) return 'Badge_06.svg' // Skilled
    if (wpm >= 70 && wpm <= 89) return 'Badge_07.svg' // Expert
    if (wpm >= 90 && wpm <=109) return 'Badge_08.svg' // Ace
    if (wpm >= 110) return 'Badge_09.svg' // Elite
    return 'Badge_01.svg' // Fallback image if WPM is invalid
}
