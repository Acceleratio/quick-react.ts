export class DataGenerator {
    private _prev: number;
    private _currentTime : Date;
    private _data : any[];

    constructor() {
        this._currentTime = new Date();
        this._data = Array(0);
    }

    private generateRandom(min: number, max: number) : number {
        return Math.random() * (max - min ) + min;
    }

    private getValue() : number {
        let next = this.generateRandom(0, 1);

        while ( Math.abs(next - this._prev) > 0.1 ) {
            next = this.generateRandom(0, 1);
        }
        this._prev = next;
        
        return next;
    }

    private addSeconds(date: Date) : Date {
        let _timeNow = new Date(date);
        _timeNow.setSeconds(_timeNow.getSeconds() + 1);
        this._currentTime = _timeNow;
        return _timeNow;   
    }

    private pushData(time: Date, value: number, data: any[]) : any[] {
        data.push({
            'time': time,
            'value': value
        });

        return data;
    }

    public generateValues() {
        let max_count = 5;

        if (this._data.length === 0) {
            max_count = 120;
        }

        for (let j = 0; j < 4; j++) {
            this._data.shift();
        }

        const value = this.generateRandom(0, 1);
        this._prev = value;
        this._data = this.pushData(this._currentTime, value, this._data);
        
        for (let i = 1; i < max_count; i++) {
            this._data = this.pushData(
                            this.addSeconds(this._currentTime), 
                            this.getValue(), 
                            this._data);
        }

        return this._data;
    }
}
