function getOffsetMinutes(timeZone: string, instant: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
  )
  const instantAtMinute = Math.floor(instant.getTime() / 60_000) * 60_000
  return Math.round((localAsUtc - instantAtMinute) / 60_000)
}

function formatTime(timeZone: string, instant: Date): string {
  return new Intl.DateTimeFormat('en', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(instant)
}

export function getWorkHourOverlap(timeZone: string, instant = new Date()) {
  const marketOffset = getOffsetMinutes(timeZone, instant)
  const sastOffset = 120
  const workdayStart = 9 * 60
  const workdayEnd = 17 * 60
  const sastStart = workdayStart - sastOffset
  const sastEnd = workdayEnd - sastOffset
  const marketStart = workdayStart - marketOffset
  const marketEnd = workdayEnd - marketOffset

  const overlapMinutes = [-1440, 0, 1440].reduce((maxOverlap, dayShift) => {
    const overlap = Math.max(0, Math.min(sastEnd, marketEnd + dayShift) - Math.max(sastStart, marketStart + dayShift))
    return Math.max(maxOverlap, overlap)
  }, 0)

  return {
    overlapMinutes,
    overlapHours: Math.floor(overlapMinutes / 60),
    remainingMinutes: overlapMinutes % 60,
    currentSastTime: formatTime('Africa/Johannesburg', instant),
    currentMarketTime: formatTime(timeZone, instant),
    marketOffsetMinutes: marketOffset,
  }
}
