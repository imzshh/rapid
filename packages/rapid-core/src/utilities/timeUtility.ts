import dayjs from "dayjs";

export function getNowString() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
}

export function getNowStringWithTimezone() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss.SSSZ");
}

export function getDateString(timeString) {
  return dayjs(timeString).format("YYYY-MM-DD");
}

export function formatDateTimeWithTimezone(source: any) {
  return dayjs(source).format("YYYY-MM-DD HH:mm:ss.SSSZ");
}
