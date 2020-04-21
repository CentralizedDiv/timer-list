export function formatTime(_seconds, returnObject = false) {
  if (typeof _seconds !== "number") {
    throw new Error("Invalid number of seconds");
  }

  let aux = Math.abs(_seconds) / 60;

  let hours = 0;
  let minutes = Math.floor(aux);
  let seconds = Math.abs(_seconds) - minutes * 60;

  if (Math.abs(_seconds) < 60) {
    seconds = Math.abs(_seconds);
  }

  if (minutes >= 60) {
    aux = minutes / 60;
    hours = Math.floor(aux);
    minutes = Math.floor(aux - hours);
  }

  let formatted = "";

  let formattedHours;
  if (hours > 0) {
    formattedHours = hours.toString().padStart(2, "0") + ":";
    formatted += formattedHours;
  }

  const formattedMinutes = minutes.toString().padStart(2, "0") + ":";
  formatted += formattedMinutes;

  const formattedSeconds = seconds.toString().padStart(2, "0");
  formatted += formattedSeconds;

  // Format negative values
  if (_seconds < 0) {
    formatted = "-";
    if (hours > 0) {
      formatted += formattedHours;
    }
    if (hours > 0 || minutes > 0) {
      formatted += formattedMinutes;
      formatted += formattedSeconds;
    } else {
      formatted += seconds.toString();
    }
  }

  if (returnObject) {
    return {
      hours,
      minutes,
      seconds,
    };
  }
  return formatted;
}

export function generateId(string) {
  var hash = 0,
    i,
    chr,
    len;
  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return "_" + hash.toString(36);
}
