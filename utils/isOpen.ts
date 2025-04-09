// export const isOpen = (opentime: string, closetime: string): boolean => {
//   const now = new Date();

//   // Convert current time to UTC, removing milliseconds for comparison
//   const currentTime = new Date(now.getTime() - now.getMilliseconds());

//   // Remove the timezone information and parse the time part (hh:mm:ss)
//   const parseTime = (time: string) => {
//     const [timeWithoutTZ] = time.split("+"); // Remove the timezone part (+00)
//     return timeWithoutTZ.split(":").map(Number); // Return [hours, minutes, seconds]
//   };

//   const [openHours, openMinutes, openSeconds] = parseTime(opentime);
//   const [closeHours, closeMinutes, closeSeconds] = parseTime(closetime);

//   // Check if parsing the time was successful
//   if (isNaN(openHours) || isNaN(openMinutes) || isNaN(openSeconds)) {
//     console.error("Error parsing open time:", opentime);
//     return false; // or handle it accordingly
//   }
//   if (isNaN(closeHours) || isNaN(closeMinutes) || isNaN(closeSeconds)) {
//     console.error("Error parsing close time:", closetime);
//     return false; // or handle it accordingly
//   }

//   // Create open and close times based on UTC date and then adjust to IST (UTC +5:30)
//   const openTime = new Date(
//     Date.UTC(
//       now.getUTCFullYear(),
//       now.getUTCMonth(),
//       now.getUTCDate(),
//       openHours,
//       openMinutes,
//       openSeconds
//     )
//   );
//   openTime.setMinutes(openTime.getMinutes() + 330); // Adding 5 hours 30 minutes for IST

//   const closeTime = new Date(
//     Date.UTC(
//       now.getUTCFullYear(),
//       now.getUTCMonth(),
//       now.getUTCDate(),
//       closeHours,
//       closeMinutes,
//       closeSeconds
//     )
//   );
//   closeTime.setMinutes(closeTime.getMinutes() + 330); // Adding 5 hours 30 minutes for IST

//   // Now compare current time (in IST) with open and close times (converted to IST)
//   // console.log("Current Time (UTC): ", currentTime);
//   // console.log("Open Time (IST): ", openTime);
//   // console.log("Close Time (IST): ", closeTime);

//   // console.log(currentTime >= openTime && currentTime <= closeTime);
//   // return currentTime >= openTime && currentTime <= closeTime;
//   console.log(opentime, "opentime");
//   console.log(closetime, "closetime");
//   return true;
// };

import moment from "moment-timezone";

export const isOpen = (
  openTime: string,
  closeTime: string,
  timezone: string = "Asia/Kolkata"
): boolean => {
  // Get current time in the provided timezone
  const now = moment().tz(timezone).format("HH:mm:ss");

  // Convert open and close times from UTC to local timezone
  const open = moment
    .utc(openTime, "HH:mm:ssZ")
    .tz(timezone)
    .format("HH:mm:ss");
  const close = moment
    .utc(closeTime, "HH:mm:ssZ")
    .tz(timezone)
    .format("HH:mm:ss");

  // Compare current time with open and close times
  return now >= open && now <= close;
};
