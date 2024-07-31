import { clsx, type ClassValue } from "clsx"
import { formatDate, formatDistanceToNowStrict } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date()
  // If the date is within the last 24 hours, show the relative time
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true })
  } else {
    // If the date is within the current year, only show the month and day
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d")
    } else {
      // Otherwise, show the full date
      return formatDate(from, "MMM d, yyyy")
    }
  }
}
