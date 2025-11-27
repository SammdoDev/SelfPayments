import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale("id");
dayjs.tz.setDefault("Asia/Jakarta");

export const formatDateTime = (date?: string | Date, format = "DD MMM YYYY HH:mm") =>
  date ? dayjs.tz(date, "Asia/Jakarta").format(format) : "-";

export const timeFromNow = (date?: string | Date) =>
  date ? dayjs.tz(date, "Asia/Jakarta").fromNow() : "-";

export const toISOString = (date?: string | Date) =>
  date ? dayjs(date).utc().toISOString() : "-";

export const toLocalTime = (date?: string | Date) =>
  date ? dayjs.utc(date).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss") : "-";

export default dayjs;

export const formatDate = (date?: string | Date, format = "DD MMM YYYY") =>
  date ? dayjs(date).locale("en").format(format) : "-";
