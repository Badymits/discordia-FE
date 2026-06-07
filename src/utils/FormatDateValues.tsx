// Declaring message formatter once only since its rendered outside component
const messageDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
})

export const formatDateTimestamp = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString)
  return messageDateFormatter.format(date).replace(",", "");
}

export const formatTimeStamp = (isoString: string) => {

  if (!isoString) return ""
  const date = new Date(isoString).getTime();
  return timeFormatter.format(date)
} 