// Real salon hours: Mon–Fri 10am–9pm, Sat–Sun 10am–10pm.
function isWeekendDate(dateKey: string): boolean {
  const [y, m, d] = dateKey.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6;
}

/** Pass the selected date to get that day's real slots; omit for the widest (weekend) range. */
export function generateTimeSlots(dateKey?: string): string[] {
  const weekend = dateKey ? isWeekendDate(dateKey) : true;
  const openMinutes = 10 * 60;
  const closeMinutes = weekend ? 22 * 60 : 21 * 60;
  const slots: string[] = [];
  for (let minutes = openMinutes; minutes <= closeMinutes - 30; minutes += 30) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    slots.push(`${hour12}:${minute.toString().padStart(2, "0")} ${period}`);
  }
  return slots;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}
