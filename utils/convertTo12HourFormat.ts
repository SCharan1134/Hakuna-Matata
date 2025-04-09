import moment from "moment-timezone";

export const convertTo12HourFormat = (
  time24: string,
  timezone: string = "Asia/Kolkata"
): string => {
  return moment.utc(time24, "HH:mm:ssZ").tz(timezone).format("hh:mm A");
};
