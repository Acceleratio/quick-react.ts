import { Schedule } from '../Scheduler.Props';

export interface IInnerSchedulerProps {
    schedule: Schedule;
    onScheduleChanged: (schedule: Schedule) => void;
}

export enum DailySheduleOptionEnum {
    EveryAmountOfDays,
    EveryWeekday
}

export enum MonthlySheduleOptionEnum {
    OnDayOfMonth = '1',
    OnDayOfWeek = '2'
}
