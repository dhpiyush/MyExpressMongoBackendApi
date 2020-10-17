import moment from "moment-timezone";

export const getIndiaDateTime = () => {
  return moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss.sss+00:00");
};
