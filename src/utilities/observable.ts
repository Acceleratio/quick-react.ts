export interface IObservable<T> {
    subscribe(listener: T): void;
    unsubscribe(listener: T): void;
    notify(): void;
}
