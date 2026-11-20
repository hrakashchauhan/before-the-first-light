import type { GameEventMap } from '../../../schemas/events';

type EventKey = keyof GameEventMap;
type EventHandler<K extends EventKey> = (payload: GameEventMap[K]) => void;

class TypedEventBus {
  private listeners: { [K in EventKey]?: Set<EventHandler<K>> } = {};

  public on<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set() as any;
    }
    const set = this.listeners[event] as Set<EventHandler<K>>;
    set.add(handler);
    return () => this.off(event, handler);
  }

  public off<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    const set = this.listeners[event] as Set<EventHandler<K>> | undefined;
    if (set) {
      set.delete(handler);
      if (set.size === 0) {
        delete this.listeners[event];
      }
    }
  }

  public emit<K extends EventKey>(event: K, payload: GameEventMap[K]): void {
    const set = this.listeners[event] as Set<EventHandler<K>> | undefined;
    if (set) {
      set.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for event "${String(event)}":`, err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners = {};
  }
}

export const eventBus = new TypedEventBus();
