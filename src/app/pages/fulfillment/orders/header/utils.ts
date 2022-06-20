import * as moment from "moment";

const apiDateFormat = "YYYY-MM-DDTHH:mm:ss";

export class Utils {
  get today() { return this.setTimeToZero(moment()); }
  get yesterday() { return this.setTimeToZero(moment(moment().subtract(1, "days"))); }
  get yesterdayend() { return this.setTimeEndDay(moment(moment().subtract(1, "days"))); }
  get threeDaysbefore() { return this.setTimeToZero(moment(moment().subtract(3, "days"))); }
  get sevenDaysbefore() { return this.setTimeToZero(moment(moment().subtract(7, "days"))); }

  setTimeToZero(date: moment.Moment): string {
    return date
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .format(apiDateFormat);
  }

  setTimeEndDay(date: moment.Moment): string {
    return date
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
      .format(apiDateFormat);
  }

  getDateOption(startTime: string, endTime: string, isCustomDate?:boolean, isDateRange?:boolean): string {
    if (startTime && endTime) {
      if (endTime === this.today && !isDateRange && !isCustomDate) {
        if (startTime === this.today) {
          return "today";
        } else if (startTime === this.threeDaysbefore) {
          return "last3Days";
        } else if (startTime === this.sevenDaysbefore) {
          return "last7Days";
        } else {
          return "customRange";
        }
      } else if (startTime === this.yesterday && endTime === this.yesterday && !isCustomDate && !isDateRange){
        return "yesterday";
      } else if (moment(endTime).diff(moment(startTime), "days") === 0 && !isDateRange) {
        console.log(!isDateRange)
        return "customDate";
      } else {
        return "customRange";
      }
    } else {
      return "allDate";
    }
  }
}
