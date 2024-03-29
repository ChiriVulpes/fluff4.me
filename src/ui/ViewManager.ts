// import { APP_NAME } from "Constants";
// import Async from "utility/Async";
// import { EventManager } from "utility/EventManager";
// import Strings from "utility/Strings";
// import URL from "utility/URL";

// declare global {
// 	const viewManager: typeof ViewManager;
// }

// const registry = Object.fromEntries([
	
// ].map((view) => [view.id, view as View.Handler<readonly Model<any, any>[]>] as const));

// View.event.subscribe("show", ({ view }) => ViewManager.show(view));
// View.event.subscribe("hide", () => ViewManager.hide());
// URL.event.subscribe("navigate", () => {
// 	ViewManager.showByHash(URL.path ?? URL.hash);
// });

// export interface IViewManagerEvents {
// 	hide: { view: View.WrapperComponent };
// 	show: { view: View.WrapperComponent };
// 	initialise: { view: View.WrapperComponent };
// }

// export default class ViewManager {

// 	public static readonly event = EventManager.make<IViewManagerEvents>();

// 	public static get registry () {
// 		return registry;
// 	}

// 	public static readonly actionRegistry: Record<string, () => any> = {};

// 	public static view?: View.WrapperComponent;

// 	public static getDefaultView () {
// 		return HomeView;
// 	}

// 	public static hasView () {
// 		return !!this.view;
// 	}

// 	public static showDefaultView () {
// 		this.getDefaultView().show();
// 	}

// 	public static showByHash (hash: string | null): void {
// 		if (hash === this.view?.hash)
// 			return;

// 		if (hash === null)
// 			return this.showDefaultView();

// 		const view = registry[hash] ?? registry[Strings.sliceTo(hash, "/")];
// 		if (view?.redirectOnLoad === true || hash === "")
// 			return this.showDefaultView();
// 		else if (view?.redirectOnLoad)
// 			return this.showByHash(view.redirectOnLoad);

// 		if (!view) {
// 			if (this.actionRegistry[hash])
// 				this.actionRegistry[hash]();

// 			else if (location.hash !== `#${hash}`)
// 				console.warn(`Tried to navigate to an unknown view '${hash}'`);

// 			ErrorView.show(404);
// 			return;
// 		}

// 		const args: any[] = [];
// 		if (view !== registry[hash])
// 			args.push(Strings.sliceAfter(hash, "/"));

// 		view.show(...args as []);
// 	}

// 	public static show (view: View.WrapperComponent) {
// 		if (this.view === view)
// 			return;

// 		const oldView = this.view;
// 		if (oldView) {
// 			oldView.event.emit("hide");
// 			this.event.emit("hide", { view: oldView });
// 			oldView.classes.add(View.Classes.Hidden);
// 			void Async.sleep(1000).then(() => oldView.remove());
// 		}

// 		this.view = view;
// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// 		(window as any).view = view;
// 		view.appendTo(document.body);
// 		view.event.until("hide", manager => manager
// 			.subscribe("updateTitle", () => this.updateDocumentTitle(view))
// 			.subscribe("updateHash", () => this.updateHash(view))
// 			.subscribe("back", () => this.hide())
// 			.subscribe("initialise", () => this.event.emit("initialise", { view })));

// 		this.updateDocumentTitle(view);
// 		this.updateHash(view);

// 		this.event.emit("show", { view });
// 	}

// 	private static updateHash (view: View.WrapperComponent) {
// 		if (view.definition.noHashChange)
// 			return;

// 		if (URL.path !== view.hash)
// 			URL.path = view.hash;

// 		if (URL.hash === URL.path)
// 			URL.hash = null;
// 	}

// 	public static hide () {
// 		history.back();
// 	}

// 	private static updateDocumentTitle (view: View.WrapperComponent) {
// 		let name = view.definition.name;
// 		if (typeof name === "function")
// 			name = name(...view._args.slice(1) as []);

// 		document.title = name ? `${name} // ${APP_NAME}` : APP_NAME;
// 	}

// 	public static registerHashAction (hash: string, action: () => any) {
// 		this.actionRegistry[hash] = action;
// 		return this;
// 	}
// }

// window.addEventListener("popstate", event => {
// 	ViewManager.showByHash(URL.path ?? URL.hash);
// 	if (!ViewManager.hasView())
// 		ViewManager.showDefaultView();
// });

// // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// (window as any).viewManager = ViewManager;
