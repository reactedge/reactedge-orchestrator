import type {ReportObserver} from "./observability/observers/report-observer.ts";
import type {BaseEvent} from "./observability/contracts/base_event.ts";
import {buildBaseEvent} from "./observability/contracts/base_event.ts";
import type {Span} from "@opentelemetry/api";
import {getTracer} from "./observability/tracing.ts";

export type ReportLevel =
    | 'info'
    | 'success'
    | 'warning'
    | 'error';

export interface ReportEntry {
    timestamp: Date;
    level: ReportLevel;
    message: string;
    context?: Record<string, unknown>;
}

export class Report {
    private entries: ReportEntry[] = [];

    private observers: ReportObserver[] = [];

    addObserver(
        observer: ReportObserver
    ): void {
        this.observers.push(observer);
    }

    private notifyObservers(
        entry: ReportEntry,
        span?: Span
    ): void {
        const event =
            this.buildBaseEventFromReport(entry);

        for (const observer of this.observers) {
            observer.notify(
                event,
                span
            );
        }
    }

    createScope(
        spanName: string
    ): ReportScope {

        const span =
            getTracer().startSpan(
                spanName
            );

        return new ReportScope(
            this,
            span
        );
    }

    info(
        message: string,
        context?: Record<string, unknown>,
        span?: Span
    ) {
        this.add(
            'info',
            message,
            context,
            span
        );
    }

    success(message: string, context?: Record<string, unknown>) {
        this.add('success', message, context);
    }

    warning(message: string, context?: Record<string, unknown>) {
        this.add('warning', message, context);
    }

    error(message: string, context?: Record<string, unknown>) {
        this.add('error', message, context);
    }

    renderConsole(): void {

        console.log('\n====================================');
        console.log('ReactEdge Build Report');
        console.log('====================================');

        for (const entry of this.entries) {

            const prefix = {
                info: '[INFO]',
                success: '[OK]',
                warning: '[WARN]',
                error: '[ERROR]'
            }[entry.level];

            console.log(
                `${prefix} ${entry.message}`
            );

            if (entry.context) {
                console.log(
                    `       ${JSON.stringify(entry.context)}`
                );
            }
        }

        console.log('====================================');
    }

    publishSummary(): void {
        const span =
            getTracer().startSpan(
                'build-summary'
            );

        span.addEvent(
            'summary',
            {
                entries: JSON.stringify(
                    this.entries
                )
            }
        );

        span.end()
    }

    getEntries(): ReportEntry[] {
        return this.entries;
    }

    private add(
        level: ReportLevel,
        message: string,
        context?: Record<string, unknown>,
        span?: Span
    ) {
        const event = {
            timestamp: new Date(),
            level,
            message,
            context
        };

        this.entries.push(event);

        this.notifyObservers(event, span);
    }

    private buildBaseEventFromReport(
        entry: ReportEntry
    ): BaseEvent {
        return buildBaseEvent(
            entry.level,
            {
                message: entry.message,
                ...entry.context
            },
            {
                service: 'reactedge-build',
                component: 'report'
            }
        );
    }
}

export class ReportScope {

    private readonly report: Report;
    private readonly span: Span;
    private summary: Record<string, unknown> = {};

    constructor(
        report: Report,
        span: Span
    ) {
        this.report = report;
        this.span = span;
    }

    info(
        message: string,
        context?: Record<string, unknown>
    ) {
        this.report.info(
            message,
            context,
            this.span
        );
    }

    success(message: string, context?: Record<string, unknown>) {
        this.report.success(message, context);
    }

    warning(message: string, context?: Record<string, unknown>) {
        this.report.warning(message, context);
    }

    error(message: string, context?: Record<string, unknown>) {
        this.report.error(message, context);
    }

    complete(
        message: string,
        context?: Record<string, unknown>
    ) {
        if (context) {
            Object.assign(
                this.summary,
                context
            );
        }
    }

    getSummary() {
        return this.summary;
    }

    end() {
        this.span.end();
    }
}