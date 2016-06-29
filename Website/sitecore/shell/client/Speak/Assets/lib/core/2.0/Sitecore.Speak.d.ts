interface SitecoreStatic {
  component(deps: Array<string>, componentType: new () => any, componentName?: string): void;
  component(componentType: new () => any, componentName?: string): void;

  module(moduleName: string): any;

  pageCode(deps: Array<string>, pageCode: any): void;
  pageCode(pageCode: any): void;
  
  plugin(deps: Array<string>, pageCode: any): void;
  plugin(pageCode: any): void;

  propertyType(propertyType: PropertyTypeDefinition)
  app: App;
}

interface PropertyTypeDefinition {
  name: string;
  get(propertyName: string): any;
  set?: (newValue: any) => void;
  isNew?:(newValue: any) => boolean;
}

interface Initial {
  presenter: string;
  depth: number;
  el: any;
  hasTemplate: boolean;
  id: string;                                                                            
  key: string;
  name: string;
  parent: Element;
  script: string;
  template: any;
}

declare var Sitecore: SitecoreStatic;

interface SitecoreApp {
  app: App;
  applications: Array<App>;
  applyPlugins(obj);
  async: any;
  component();
  exposeComponent(comp, app);
  extend(obj: Object);
  init(callback);
  isDebug(): boolean;
  listenTo(obj, name, callback);
  listenToOnce(obj, name, callback);
  loaded: any;
  module(name: string, moduleDefinition: any): any;
  off(name: string, callback: (data?: Object) => void, context?: any);
  on(name: string, callback: (data?: Object) => void, context?: any);
  once(name: string, callback: (data?: Object) => void, context?: any);
  pageCode: any;
  parser: any;
  plugin();
  presenter: any;
  ready(callback);
  stopListening(obj, name, callback): void;
  template: any;
  tmpl: any;
  trigger(eventName: string, data?: Object);
  uniqueId(prefix: string);
  utils: any;
}

interface App {
  children: Array<App>;
  components: Array<Component>;
  depth: number;
  el: Element;
  findApplication(appName: string): App;
  findComponent(componentName: string): Component;
  key: string;
  listenTo: any;
  listenToOnce: any;
  off(name: string, callback: (data?: Object) => void, context?: any);
  on(name: string, callback: (data?: Object) => void, context?: any);
  once(name: string, callback: (data?: Object) => void, context?: any);
  pageCode: any;
  parent: App;
  stopListening(obj, name, callback): void;
  trigger(eventName: string, data?: Object);
  closeDialog(returnValue: any): void;
  remove(el: string): App;
  replace(config: any, callback): void;
  append(config: any, callback): void;
  prepend(config: any, callback): void;
  insertRendering(itemId: string, options:any, callback): void;
  insertMarkups(html: string, name: string, options:any, callback): void;
  inject(config: any, callback): void;
}

interface Component {
  app: App;
  children: Array<Component>;
  depth: number;
  el: Element;
  hasTemplate: boolean;
  initialize(initial: Initial, app: App, el: Element, sitecore: SitecoreApp): void;
  initialized(initial: Initial, app: App, el: Element, sitecore: SitecoreApp): void;
  id: string;
  key: string;
  listenTo(obj, name, callback);
  listenToOnce(obj, name, callback);
  name: string;
  off(name: string, callback: (data?: Object) => void, context?: any);
  on(name: string, callback: (data?: Object) => void, context?: any);
  once(name: string, callback: (data?: Object) => void, context?: any);
  parent: Component;
  placeholder: any;
  presenter: string;
  presenterScript: string;
  properties: any;
  render(): void;
  serialize(): void;
  script: string;
  template: any;
  trigger(eventName: string, data?: Object);
  type: string;
}
