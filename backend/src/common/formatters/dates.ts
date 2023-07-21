import { DateTime, Settings, Duration, DurationUnit } from "luxon";
import {
    formatDistanceToNow, formatDistance, format, isYesterday,
    isSameWeek, isSameYear, min, max, addDays, addWeeks, addMonths, addYears,
    getDayOfYear, getQuarter, getWeekOfMonth
} from "date-fns";
import { es, enUS } from "date-fns/locale";

//! Relative imports is required by typeorm migrations
import { DATE_DIFF } from "src/common/enums/dates";

type PeriodType = 'once' | 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly';
type PartOfYear = 'dayOfYear' | 'dayOfWeek' | 'dayOfMonth' | 'weekOfMonth' | 'weekOfYear' | 'fortnight' | 'month' | 'quarter' | 'year';

export abstract class DateTimeService {

    abstract fromISOToDatetime(date: string): DateTime;
    abstract toDatetime(date: Date): DateTime;
    abstract toDate(date: DateTime): Date;
    abstract now(): DateTime;

    abstract tranform(date: Date, value: number, type: DATE_DIFF): DateTime;
    abstract transformFromNow(value: number, type: DATE_DIFF): DateTime;

    abstract diffBetween(initialDate: Date, LaterDate: Date): Duration;
    abstract totalDurationBetweenDates(initialDate: Date, LaterDate: Date, duration: DurationUnit): number;
    abstract equals: (date1: Date, date2: Date) => boolean;

    abstract isValidDate: (date: any) => boolean
    abstract dateDistance: (date: Date, baseDate: Date, lang: string, addSuffix: boolean) => string
    abstract dateDistanceToNow: (date: Date, lang: string, addSuffix: boolean, includeSeconds: boolean) => string
    abstract getFriendlyDateTime: (date: Date, lang: string, exact: boolean) => string
    abstract dateFormatToString: (date: Date, lang: string, dateFormat: string) => string
    abstract shortDateDividerHelper: (date: Date, lang: string, includeHourAfterToday: boolean) => string

    abstract isBefore: (date: Date, dateToCompare: Date) => boolean
    abstract isAfter: (date: Date, dateToCompare: Date) => boolean
    abstract isBetween: (date: Date, start_date: Date, end_date: Date) => boolean
    abstract isToday: (date: Date) => boolean
    abstract minDate: (dates: Date[]) => Date
    abstract maxDate: (dates: Date[]) => Date
    abstract calculateFrequencyDate: (initialDate: Date, period: string | PeriodType) => Date
    abstract getPartOfDate(date: Date, part: PartOfYear): number
    abstract addDaysToDate(date: Date, days: number): Date
}

export const LuxonService: DateTimeService = class {

    static fromISOToDatetime(date: string) {
        return DateTime.fromISO(date);
    }

    static toDatetime(date: Date) {
        const instance = DateTime.fromJSDate(date);
        return instance;
    }

    static toDate(date: DateTime) {
        return date.toJSDate();
    }

    static now() {
        return DateTime.now();
    }

    static tranform(date: Date, value: number, type: DATE_DIFF) {

        const instance = this.toDatetime(date);

        switch (type) {
            case DATE_DIFF.MINUTE:
                return instance.plus({ minutes: value });
            case DATE_DIFF.HOUR:
                return instance.plus({ hours: value });
            case DATE_DIFF.DAY:
                return instance.plus({ days: value });
            case DATE_DIFF.WEEK:
                return instance.plus({ weeks: value });
            case DATE_DIFF.MONTH:
                return instance.plus({ month: value });
            case DATE_DIFF.YEAR:
                return instance.plus({ year: value });
            default:
                return instance;
        }
    }

    static sortDescending(): (a: Date, b: Date) => number {

        return (a: Date, b: Date) => {
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        }
    }

    static sortAscending(): (a: Date, b: Date) => number {

        return (a: Date, b: Date) => {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }
    }


    static transformFromNow(value: number, type: DATE_DIFF) {
        return this.tranform(DateTime.now().toJSDate(), value, type);
    }

    static diffBetween(initialDate: Date, LaterDate: Date) {

        const dtIni = this.toDatetime(initialDate);
        const dtLater = this.toDatetime(LaterDate);
        const dur = dtLater.diff(dtIni, [ "years", "months", "weeks", "days", "hours", "minutes", "seconds", ]);
        return dur;
    }

    static totalDurationBetweenDates(initialDate: Date, LaterDate: Date, duration: DurationUnit) {
        const dur = this.diffBetween(initialDate, LaterDate);
        return dur.as(duration);
    }

    static equals(date1: Date, date2: Date) {
        return this.toDatetime(date1).toISODate() === this.toDatetime(date2).toISODate();
    }

    static setGlobalLocale() {
        Settings.defaultLocale = "es-hn";
    }

    static isValidDate(date: any) {

        if (!date || date == "Invalid Date")
            return false;

        return true;
    }

    static dateDistance(date: Date, baseDate: Date, lang: string, addSuffix: boolean = true) {

        if (!date)
            return "";

        const options = { includeSeconds: false, addSuffix: addSuffix, locale: lang === "es" ? es : enUS };
        const result = formatDistance(date, baseDate, options);

        return result;
    }

    static dateDistanceToNow(date: Date, lang: string, addSuffix: boolean = true, includeSeconds: boolean = true) {

        if (!date)
            return "";

        const options = { includeSeconds: includeSeconds, addSuffix: addSuffix, locale: lang === "es" ? es : enUS };
        const result = formatDistanceToNow(date, options);

        return result;
    }

    static getFriendlyDateTime(date: Date, lang: string, exact: boolean = false) {

        if (!this.isValidDate(date))
            return "Unknown";

        if (exact) {
            const fmt = lang === "es" ? `dd 'de' MMM yyyy h:m aaaa` : "MMM dd, yyyy H:m";
            return format(new Date(date), fmt, { locale: lang === "es" ? es : enUS });
        }
        else {
            const options = { includeSeconds: true, addSuffix: true, locale: lang === "es" ? es : enUS };
            const created = new Date(date);
            const result = formatDistanceToNow(created, options);
            return result;
        }
    }

    static dateFormatToString(date: Date, lang: string, dateFormat: string = "MMM dd yyyy  H:m:s") {

        if (!this.isValidDate(date))
            return "Unknown";


        return format(new Date(date), dateFormat,
            {
                locale: lang === "es" ? es : enUS,
                weekStartsOn: 1
            });
    }

    static shortDateDividerHelper(date: Date, lang: string, includeHourAfterToday: boolean = false) {

        try {
            if (!this.isValidDate(date))
                return "";

            const current = new Date();

            const hourFormat = "hh:mm aaaa";
            const addFormat = includeHourAfterToday ? ` ${hourFormat}` : "";

            if (this.isToday(date))
                return this.dateFormatToString(date, lang, hourFormat)

            if (isYesterday(date)) {
                const lbYesterday = lang === "es" ? "Ayer " : "Yesterday ";
                return lbYesterday + (includeHourAfterToday ? this.dateFormatToString(date, lang, hourFormat) : "");
            }

            if (isSameWeek(date, current))
                return this.dateFormatToString(date, lang, "EEEE" + addFormat);

            if (isSameYear(date, current)) {
                const fmt_sy = lang === "es" ? "dd MMM" : "MMM dd";
                return this.dateFormatToString(date, lang, fmt_sy + addFormat);
            }

            const fmt_gen = lang === "es" ? "dd/MM/yyyy" : "MM/dd/yyyy";
            return this.dateFormatToString(date, lang, fmt_gen + addFormat);
        }
        catch (error) {
            return "error";
        }
    }

    static isToday(date: Date) {
        return this.equals(date, new Date());
    }

    static isBefore(date: Date, dateToCompare: Date) {

        //! Neither Luxon nor Date-fns work with dates with time, so we need to remove the time from the date        
        const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const date2 = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth(), dateToCompare.getDate());

        return date1.getTime() < date2.getTime();

    }

    static isAfter(date: Date, dateToCompare: Date) {

        //! Neither Luxon nor Date-fns work with dates with time, so we need to remove the time from the date
        const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const date2 = new Date(dateToCompare.getFullYear(), dateToCompare.getMonth(), dateToCompare.getDate());

        return date1.getTime() > date2.getTime();
    }

    static isBetween(date: Date, start_date: Date, end_date: Date) {

        if (!date)
            return false;

        if (!start_date && !end_date)
            return false

        if (!start_date)
            return this.isBefore(date, end_date);

        if (!end_date)
            return this.isAfter(date, start_date);

        // const _date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        // const _start_date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
        // const _end_date = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());

        return (this.equals(date, start_date) || this.isAfter(date, start_date)) && (this.equals(date, end_date) || this.isBefore(date, end_date));
    }

    static minDate(dates: Date[]) {
        return min(dates);
    }

    static maxDate(dates: Date[]) {
        return max(dates);
    }

    static addDaysToDate(date: Date, days: number) {
        const result = addDays(new Date(date), days);
        return result;
    }

    static calculateFrequencyDate = (initialDate: Date, period: string | PeriodType) => {

        if (!initialDate)
            return null;

        let result = new Date(initialDate);

        const _periodo = (period || '').toLowerCase().trim() as PeriodType;

        if (!period)
            throw new Error('Period is required');

        switch (_periodo) {
            case 'once':
                return result;
            case 'daily':
                return addDays(initialDate, 1);
            case 'weekly':
                return addWeeks(initialDate, 1);
            case 'fortnightly':
                return addWeeks(initialDate, 2);
            case 'monthly':
                return addMonths(initialDate, 1);
            case 'quarterly':
                return addMonths(initialDate, 3);
            case 'yearly':
                return addYears(initialDate, 1);
            default:
                throw new Error('Invalid period');
        }
    }

    static splitDate = (date: Date) => {

        if (!date)
            return null;

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return { year, month, day };
    }

    static getWeekNumber(d: Date) {


        const { year, month, day } = this.splitDate(d)
        return DateTime.local(year, month, day).weekNumber;

        // // Copy date so don't modify original
        // d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

        // // Set to nearest Thursday: current date + 4 - current day number
        // // Make Sunday's day number 7
        // d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

        // // Get first day of year
        // const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

        // // Calculate full weeks to nearest Thursday
        // const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);

        // // Return array of year and week number
        // return weekNo;
    }

    static getPartOfDate(date: Date, part: PartOfYear) {

        const { year, month, day } = this.splitDate(date);
        const dt = DateTime.local(year, month, day, 0, 0, 0);

        switch (part) {
            case 'dayOfYear':
                //* Get the day of the year (1-366)
                return getDayOfYear(date);
            case 'dayOfWeek':
                //* Get the day of the week (1-7), starting on Monday
                return dt.weekday;
            case 'dayOfMonth':
                //* Get the day of the month (1-31)
                return dt.day;
            case 'weekOfMonth':
                //* Get the week of the month (1-5)
                const w = getWeekOfMonth(date, { weekStartsOn: 0 });
                return w === 0 ? 1 : w;
            case 'weekOfYear':
                //* Get the week of the year (1-53)
                return dt.weekNumber;
            case 'fortnight': {
                const wn = dt.weekNumber;
                return Math.ceil(wn / 2);
            }
            case 'month':
                //* Get the month of the year (1-12) 
                return dt.month;
            case 'quarter':
                return getQuarter(date);
            case 'year':
                return dt.year;
            default:
                throw new Error('Invalid part');
        }
    }
};