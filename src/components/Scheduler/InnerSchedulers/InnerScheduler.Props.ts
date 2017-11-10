import {Schedule } from '../Scheduler.Props';

export interface IInnerSchedulerProps {
    schedule: Schedule;
    onScheduleChanged: (schedule: Schedule) => void;
}

