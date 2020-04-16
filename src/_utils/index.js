export function formatTime(_seconds, returnObject = false) {
  if (typeof _seconds !== "number") {
    throw new Error("Invalid number of seconds");
  }

  let aux = _seconds / 60;

  let hours = 0;
  let minutes = Math.floor(aux);
  let seconds = _seconds - minutes * 60;

  if (_seconds < 60) {
    seconds = _seconds;
  }

  if (minutes >= 60) {
    aux = minutes / 60;
    hours = Math.floor(aux);
    minutes = Math.floor(aux - hours);
  }

  let formatted = "";

  if (hours > 0) {
    hours = hours.toString().padStart(2, "0") + ":";
    formatted += hours;
  }

  minutes = minutes.toString().padStart(2, "0") + ":";
  formatted += minutes;

  seconds = seconds.toString().padStart(2, "0");
  formatted += seconds;

  if (returnObject) {
    return {
      hours,
      minutes,
      seconds,
    };
  }
  return formatted;
}
