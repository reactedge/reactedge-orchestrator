import {BaseEvent} from "./contracts/base_event.ts";
import {ReportObserver} from "./observers/report-observer.ts";

export class EventBus {

    private observers: ReportObserver[] = [];

    publish(
        event: BaseEvent
    ): void {

        for (const observer of this.observers) {
            observer.notify(event);
        }
    }
}