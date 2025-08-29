import moment from "moment";

/**
 * Get minutes from ISO 8601 duration
 * @param iso8601Format duration in ISO 8601
 * @returns duration in minutes
 */
export const getMinutes = (iso8601Format: string): number => {
  return moment.duration(iso8601Format as moment.DurationInputArg1).asMinutes();
};

/**
 * Get duration and concat minutes label
 * @param iso8601Format duration in ISO 8601
 * @returns duration label
 */
export const getMinutesFormat = (iso8601Format: string): string => {
  return getMinutes(iso8601Format) + " minutes";
};
