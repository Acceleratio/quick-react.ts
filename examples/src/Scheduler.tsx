/* tslint:disable:no-console */
import 'babel-polyfill';
import 'ts-helpers';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Scheduler } from './../../src/components/Scheduler/Scheduler';
import { DaysOfWeekEnum } from '../../src/index';

export class Index extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            schedule: {
                recurrencePeriod: 2,
                daysOfWeek: DaysOfWeekEnum.EveryDay,
                startTime: new Date(),
                sendOnSpecificDays: true,
                sendOnSpecificWeekDays: false,
                daysOfMonth: 1,
                weeksOfMonth: 1
            },
            selectedScheduleType: 7
        };
    }
    public render() {

        return (
            <div>
                <Scheduler
                    selectedScheduleType={this.state.selectedScheduleType}
                    onScheduleChanged={this.onScheduleChanged}
                    scheduleTypeChanged={this.onScheduleTypeChanged}
                    schedule={this.state.schedule}
                    {...this.state.schedule}
                />
            </div>


        );
    }

    onScheduleChanged = (schedule) => {
        this.setState({
            ...this.state,
            schedule: schedule
        });
    }

    onScheduleTypeChanged = (scheduleType, index) => {
        this.setState({
            ...this.state,
            selectedScheduleType: scheduleType.key
        });
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));
