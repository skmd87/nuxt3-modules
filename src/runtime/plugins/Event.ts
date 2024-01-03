import mitt from "mitt";
import { defineNuxtPlugin } from "#app";
import type { Events } from "#Nuxt3Modules";

type EventsType = Events;
type EventName = keyof EventsType;
type Payload = EventsType[EventName];
type TotalEvents = { [key in EventName]: Payload };


const emitter = mitt<TotalEvents>();

declare module "#app" {
    interface NuxtApp {
        $on: typeof emitter.on;
        $emit: typeof emitter.emit;
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            emit: emitter.emit,
            on: emitter.on
        },
    };
});
