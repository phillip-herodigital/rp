export class PageCode {
  on: (name: string, callback: (data?: Object) => void, context?: any) => void;
  off: (name: string, callback: (data?: Object) => void, context?: any) => void;
  once: (name: string, callback: (data?: Object) => void, context?: any) => void;
  trigger: (eventName: string, data?: Object) => void;
}
