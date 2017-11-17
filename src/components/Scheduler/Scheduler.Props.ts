import { IDropdownOption } from '../Dropdown/Dropdown.Props';

export interface ISchedulerProps {
    selectedScheduleType: ScheduleTypeEnum;
    schedule: Schedule;
    className?: string;
    scheduleTypeChanged: (option: IDropdownOption, index?: number) => void;
    onScheduleChanged: (schedule: Schedule) => void;
    dropdownOptions?: IDropdownOption[];
    dropdownLabel?: string;
}

export interface Schedule {
    startTime: Date;
    sendOnSpecificDays: boolean;
    daysOfMonth: DayOfMonthEnum; 
    sendOnSpecificWeekDays: boolean; 
    weeksOfMonth: WeeksOfMonthEnum;
    daysOfWeek: DaysOfWeekEnum;
    recurrencePeriod: number;
}

export enum DaysOfWeekEnum {
    Sunday = 1,
    Monday = 2,
    Tuesday = 4,
    Wednesday = 8,
    Thursday = 16,
    Friday = 32,
    WorkDays = 62,
    Saturday = 64,
    WeekendDays = 65,
    EveryDay = 127
}

export enum DayOfMonthEnum {
    Day1 = 1,
    Day2 = 2,
    Day3 = 4,
    Day4 = 8,
    Day5 = 16,
    Day6 = 32,
    Day7 = 64,
    Day8 = 128,
    Day9 = 256,
    Day10 = 512,
    Day11 = 1024,
    Day12 = 2048,
    Day13 = 4096,
    Day14 = 8192,
    Day15 = 16384,
    Day16 = 32768,
    Day17 = 65536,
    Day18 = 131072,
    Day19 = 262144,
    Day20 = 524288,
    Day21 = 1048576,
    Day22 = 2097152,
    Day23 = 4194304,
    Day24 = 8388608,
    Day25 = 16777216,
    Day26 = 33554432,
    Day27 = 67108864,
    Day28 = 134217728,
    Day29 = 268435456,
    Day30 = 536870912,
    Day31 = 1073741824,
    Everyday = 2147483647,
    Last = 4294967294
}

export enum WeeksOfMonthEnum {
    None = 0,
    First = 1,
    Second = 2,
    Third = 3,
    Fourth = 4,
    Last = 5
}

export enum ScheduleTypeEnum {
    OneTime = 1,
    Daily = 2,
    Weekly = 3,
    Monthly = 4,
    Quarterly = 5,
    Minutely = 6,
    Hourly = 7
}
