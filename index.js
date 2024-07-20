"use strict";
define("Constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.APP_NAME = void 0;
    exports.APP_NAME = "fluff4.me / Queer Webnovels";
});
define("utility/Env", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Env {
        async load() {
            const origin = location.origin;
            const root = location.pathname.startsWith("/beta/") ? "/beta/" : "/";
            Object.assign(this, await fetch(origin + root + "env.json").then(response => response.json()));
            document.documentElement.classList.add(`environment-${this.ENVIRONMENT}`);
        }
    }
    exports.default = new Env;
});
define("utility/Session", ["require", "exports", "utility/Env"], function (require, exports, Env_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Session;
    (function (Session) {
        async function refresh(response) {
            const headers = {
                "Accept": "application/json",
            };
            response ??= await fetch(`${Env_1.default.API_ORIGIN}session`, { headers, credentials: "include" });
            const stateToken = response.headers.get("State-Token");
            if (stateToken)
                localStorage.setItem("State-Token", stateToken);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const session = await response.json().catch(() => ({}));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            localStorage.setItem("Session-Auth-Services", JSON.stringify(session?.data?.authServices ?? {}));
        }
        Session.refresh = refresh;
        function getStateToken() {
            return localStorage.getItem("State-Token");
        }
        Session.getStateToken = getStateToken;
        function getAuthServices() {
            const authServicesString = localStorage.getItem("Session-Auth-Services");
            return authServicesString && JSON.parse(authServicesString) || {};
        }
        Session.getAuthServices = getAuthServices;
    })(Session || (Session = {}));
    exports.default = Session;
});
define("dev/ButtonRegistry", ["require", "exports", "utility/Env", "utility/Session"], function (require, exports, Env_2, Session_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BUTTON_REGISTRY = void 0;
    exports.BUTTON_REGISTRY = {
        createAuthor: {
            name: "Create Author",
            async execute(name, vanity) {
                await fetch(`${Env_2.default.API_ORIGIN}author/create`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        vanity: vanity,
                    }),
                });
                await Session_1.default.refresh();
            },
        },
        updateAuthor: {
            name: "Update Author",
            async execute(name, description, vanity, support_link, support_message) {
                await fetch(`${Env_2.default.API_ORIGIN}author/update`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        vanity: vanity,
                        support_link: support_link,
                        support_message: support_message,
                    }),
                });
            },
        },
        viewAuthor: {
            name: "View Author",
            async execute(label, vanity) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}author/${vanity}/get`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(label, response);
            },
        },
        clearSession: {
            name: "Clear Session",
            async execute() {
                await fetch(`${Env_2.default.API_ORIGIN}session/reset`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                });
                await Session_1.default.refresh();
            },
        },
        createWork: {
            name: "Create Work",
            async execute(name, description, vanity, status, visibility) {
                await fetch(`${Env_2.default.API_ORIGIN}work/create`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        vanity: vanity,
                        status: status,
                        visibility: visibility,
                    }),
                });
            },
        },
        updateWork: {
            name: "Update Work",
            async execute(url, name, description, vanity, status, visibility) {
                await fetch(`${Env_2.default.API_ORIGIN}work/${url}/update`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        vanity: vanity,
                        status: status,
                        visibility: visibility,
                    }),
                });
            },
        },
        deleteWork: {
            name: "Delete Work",
            async execute(url) {
                await fetch(`${Env_2.default.API_ORIGIN}work/${url}/delete`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
        viewWork: {
            name: "View Work",
            async execute(label, url) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}work/${url}/get`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(label, response);
            },
        },
        createChapter: {
            name: "Create Chapter",
            async execute(name, body, work_url, visibility) {
                await fetch(`${Env_2.default.API_ORIGIN}work/${work_url}/chapter/create`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        body: body,
                        visibility: visibility,
                    }),
                });
            },
        },
        updateChapter: {
            name: "Update Chapter",
            async execute(workVanity, index, name, body, visibility) {
                await fetch(`${Env_2.default.API_ORIGIN}work/${workVanity}/chapter/${index}/update`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        body,
                        visibility,
                    }),
                });
            },
        },
        deleteChapter: {
            name: "Delete Chapter",
            async execute(work_url, index) {
                await fetch(`${Env_2.default.API_ORIGIN}work/${work_url}/chapter/${index}/delete`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
        viewChapter: {
            name: "View Chapter",
            async execute(label, work_url, index) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}work/${work_url}/chapter/${index}/get`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(label, response);
            },
        },
        follow: {
            name: "Follow",
            async execute(type, vanity) {
                await fetch(`${Env_2.default.API_ORIGIN}follow/${type}/${vanity}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
        unfollow: {
            name: "Unfollow",
            async execute(type, vanity) {
                await fetch(`${Env_2.default.API_ORIGIN}unfollow/${type}/${vanity}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
        getFollow: {
            name: "Get Follow",
            async execute(type, vanity) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}follows/${type}/${vanity}`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(response);
            },
        },
        getAllFollows: {
            name: "Get All Follows",
            async execute(type, page = 0) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}following/${type}?page=${page}`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(response);
            },
        },
        getAllFollowsMerged: {
            name: "Get All Follows Merged",
            async execute(page = 0) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}following?page=${page}`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(response);
            },
        },
        ignore: {
            name: "Ignore",
            async execute(type, vanity) {
                await fetch(`${Env_2.default.API_ORIGIN}ignore/${type}/${vanity}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
        unignore: {
            name: "Unignore",
            async execute(type, vanity) {
                await fetch(`${Env_2.default.API_ORIGIN}unignore/${type}/${vanity}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
        getIgnore: {
            name: "Get Ignore",
            async execute(type, vanity) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}ignores/${type}/${vanity}`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(response);
            },
        },
        getAllIgnores: {
            name: "Get All Ignores",
            async execute(type, page = 0) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}ignoring/${type}?page=${page}`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(response);
            },
        },
        getAllIgnoresMerged: {
            name: "Get All Ignores Merged",
            async execute(page = 0) {
                const response = await fetch(`${Env_2.default.API_ORIGIN}ignoring?page=${page}`, {
                    credentials: "include",
                }).then(response => response.json());
                console.log(response);
            },
        },
    };
});
define("utility/EventManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventManager = void 0;
    class EventManager {
        static make() {
            return new EventManager({});
        }
        static emit(target, event, init) {
            if (init instanceof Event)
                event = init;
            if (typeof event === "string")
                event = new Event(event, { cancelable: true });
            if (typeof init === "function")
                init?.(event);
            else if (init && event !== init)
                Object.assign(event, init);
            target?.dispatchEvent(event);
            return event;
        }
        get target() {
            return this._target instanceof WeakRef ? this._target.deref() : this._target;
        }
        constructor(host, target = new EventTarget()) {
            this.subscriptions = {};
            this.pipeTargets = new Map();
            this.pipes = new Map();
            this.host = new WeakRef(host);
            this._target = target;
        }
        subscribe(type, listener) {
            if (!Array.isArray(type))
                type = [type];
            for (const t of type)
                this.target?.addEventListener(t, listener);
            return this.host.deref();
        }
        subscribeOnce(types, listener) {
            if (!Array.isArray(types))
                types = [types];
            if (this.target) {
                const target = this.target;
                const subscriptions = this.subscriptions;
                function realListener(event) {
                    listener.call(this, event);
                    for (const type of types) {
                        subscriptions[type]?.delete(listener);
                        target?.removeEventListener(type, realListener);
                    }
                }
                for (const type of types) {
                    subscriptions[type] ??= new WeakMap();
                    subscriptions[type].set(listener, realListener);
                    this.target?.addEventListener(type, realListener);
                }
            }
            return this.host.deref();
        }
        unsubscribe(types, listener) {
            if (!Array.isArray(types))
                types = [types];
            for (const type of types) {
                this.target?.removeEventListener(type, listener);
                const realListener = this.subscriptions[type]?.get(listener);
                if (realListener) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    this.target?.removeEventListener(type, realListener);
                    this.subscriptions[type].delete(listener);
                }
            }
            return this.host.deref();
        }
        async waitFor(types) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return new Promise(resolve => this.subscribeOnce(types, resolve));
        }
        until(promise, initialiser) {
            if (typeof promise !== "object")
                promise = this.waitFor(promise);
            const manager = {
                subscribe: (type, listener) => {
                    this.subscribe(type, listener);
                    void promise.then(() => this.unsubscribe(type, listener));
                    return manager;
                },
                subscribeOnce: (type, listener) => {
                    this.subscribeOnce(type, listener);
                    void promise.then(() => this.unsubscribe(type, listener));
                    return manager;
                },
            };
            initialiser?.(manager);
            return this.host.deref();
        }
        emit(event, init) {
            event = EventManager.emit(this.target, event, init);
            const pipeTargets = this.pipeTargets.get(event.type);
            if (pipeTargets) {
                for (let i = 0; i < pipeTargets.length; i++) {
                    const pipeTarget = pipeTargets[i].deref();
                    if (pipeTarget)
                        pipeTarget.dispatchEvent(event);
                    else
                        pipeTargets.splice(i--, 1);
                }
                if (!pipeTargets.length)
                    this.pipeTargets.delete(event.type);
            }
            return this.host.deref();
        }
        pipe(type, on) {
            const typeName = type;
            on.insertPipe(typeName, this._target instanceof WeakRef ? this._target : new WeakRef(this._target));
            let pipes = this.pipes.get(typeName);
            if (!pipes) {
                pipes = [];
                this.pipes.set(typeName, pipes);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            pipes.push(new WeakRef(on));
            return this;
        }
        insertPipe(type, target) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            let pipeTargets = this.pipeTargets.get(type);
            if (!pipeTargets) {
                pipeTargets = [];
                this.pipeTargets.set(type, pipeTargets);
            }
            pipeTargets.push(target);
            const pipes = this.pipes.get(type);
            if (pipes) {
                for (let i = 0; i < pipes.length; i++) {
                    const pipe = pipes[i].deref();
                    if (pipe)
                        pipe.insertPipe(type, target);
                    else
                        pipes.splice(i--, 1);
                }
                if (!pipes.length)
                    this.pipes.delete(type);
            }
        }
    }
    exports.EventManager = EventManager;
    EventManager.global = EventManager.make();
});
define("ui/UiEventBus", ["require", "exports", "utility/EventManager"], function (require, exports, EventManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const UiEventBus = EventManager_1.EventManager.make();
    let lastUsed = 0;
    const state = {};
    const mouseKeyMap = {
        [0]: "MouseLeft",
        [1]: "MouseMiddle",
        [2]: "MouseRight",
        [3]: "Mouse3",
        [4]: "Mouse4",
        [5]: "Mouse5",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        [`${undefined}`]: "Mouse?",
    };
    function emitKeyEvent(e) {
        const input = e.target.closest("input[type=text], textarea, [contenteditable]");
        let usedByInput = !!input;
        const eventKey = e.key ?? mouseKeyMap[e.button];
        const eventType = e.type === "mousedown" ? "keydown" : e.type === "mouseup" ? "keyup" : e.type;
        if (eventType === "keydown")
            state[eventKey] = Date.now();
        let cancelInput = false;
        const event = {
            key: eventKey,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            used: usedByInput,
            input,
            use: (key, ...modifiers) => {
                if (event.used)
                    return false;
                const matches = event.matches(key, ...modifiers);
                if (matches)
                    event.used = true;
                return matches;
            },
            useOverInput: (key, ...modifiers) => {
                if (event.used && !usedByInput)
                    return false;
                const matches = event.matches(key, ...modifiers);
                if (matches) {
                    event.used = true;
                    usedByInput = false;
                }
                return matches;
            },
            matches: (key, ...modifiers) => {
                if (eventKey !== key)
                    return false;
                if (!modifiers.every(modifier => event[modifier]))
                    return false;
                return true;
            },
            cancelInput: () => cancelInput = true,
            hovering: (selector) => {
                const hovered = [...document.querySelectorAll(":hover")];
                return selector ? hovered[hovered.length - 1]?.closest(selector) ?? undefined : hovered[hovered.length - 1];
            },
        };
        if (eventType === "keyup") {
            event.usedAnotherKeyDuring = lastUsed > (state[eventKey] ?? 0);
            delete state[eventKey];
        }
        UiEventBus.emit(eventType, event);
        if ((event.used && !usedByInput) || (usedByInput && cancelInput)) {
            e.preventDefault();
            lastUsed = Date.now();
        }
    }
    document.addEventListener("keydown", emitKeyEvent);
    document.addEventListener("keyup", emitKeyEvent);
    document.addEventListener("mousedown", emitKeyEvent);
    document.addEventListener("mouseup", emitKeyEvent);
    document.addEventListener("click", emitKeyEvent);
    Object.defineProperty(MouseEvent.prototype, "used", {
        get() {
            return this._used ?? false;
        },
    });
    Object.defineProperty(MouseEvent.prototype, "use", {
        value: function (key, ...modifiers) {
            if (this._used)
                return false;
            const matches = this.matches(key, ...modifiers);
            if (matches) {
                this._used = true;
                // allow click & contextmenu handlers to be considered "used" for IKeyUpEvents
                lastUsed = Date.now();
            }
            return matches;
        },
    });
    Object.defineProperty(MouseEvent.prototype, "matches", {
        value: function (key, ...modifiers) {
            if (mouseKeyMap[this.button] !== key)
                return false;
            if (!modifiers.every(modifier => this[`${modifier}Key`]))
                return false;
            return true;
        },
    });
    exports.default = UiEventBus;
});
define("utility/Popup", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function popup(url, width = 600, height = 800) {
        const left = (window.innerWidth - width) / 2 + window.screenLeft;
        const top = (window.innerHeight - height) / 2 + window.screenTop;
        return new Promise((resolve, reject) => {
            localStorage.removeItem("Popup-Error-Code");
            localStorage.removeItem("Popup-Error-Message");
            const options = "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
            const oauthPopup = window.open(url, "Discord OAuth", options);
            const interval = setInterval(() => {
                if (oauthPopup?.closed) {
                    clearInterval(interval);
                    const code = +localStorage.getItem("Popup-Error-Code");
                    const message = localStorage.getItem("Popup-Error-Message");
                    if (code || message)
                        return reject(Object.assign(new Error(message ?? "Internal Server Error"), { code }));
                    resolve();
                }
            }, 100);
        });
    }
    exports.default = popup;
});
define("Fluff4me", ["require", "exports", "dev/ButtonRegistry", "ui/UiEventBus", "utility/Env", "utility/Popup", "utility/Session"], function (require, exports, ButtonRegistry_1, UiEventBus_1, Env_3, Popup_1, Session_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    if (location.pathname.startsWith("/auth/")) {
        if (location.pathname.endsWith("/error")) {
            const params = new URLSearchParams(location.search);
            debugger;
            localStorage.setItem("Popup-Error-Code", params.get("code") ?? "500");
            localStorage.setItem("Popup-Error-Message", params.get("message") ?? "Internal Server Error");
        }
        window.close();
    }
    void screen?.orientation?.lock?.("portrait-primary").catch(() => { });
    class Fluff4me {
        constructor() {
            void this.main();
        }
        async main() {
            UiEventBus_1.default.subscribe("keydown", event => {
                if (event.use("F6"))
                    for (const stylesheet of document.querySelectorAll("link[rel=stylesheet]")) {
                        const href = stylesheet.getAttribute("href");
                        const newHref = `${href.slice(0, Math.max(0, href.indexOf("?")) || Infinity)}?${Math.random().toString().slice(2)}`;
                        stylesheet.setAttribute("href", newHref);
                    }
                if (event.use("F4"))
                    document.documentElement.classList.add("persist-tooltips");
            });
            UiEventBus_1.default.subscribe("keyup", event => {
                if (event.use("F4"))
                    document.documentElement.classList.remove("persist-tooltips");
            });
            await Env_3.default.load();
            // const path = URL.path ?? URL.hash;
            // if (path === AuthView.id) {
            // 	URL.hash = null;
            // 	URL.path = null;
            // }
            // ViewManager.showByHash(URL.path ?? URL.hash);
            await Session_2.default.refresh();
            const createButton = (implementation, ...args) => {
                const button = document.createElement("button");
                button.textContent = implementation.name;
                button.addEventListener("click", async () => {
                    try {
                        await implementation.execute(...args);
                    }
                    catch (err) {
                        const error = err;
                        console.warn(`Button ${implementation.name} failed to execute:`, error);
                    }
                });
                return button;
            };
            const oauthDiv = document.createElement("div");
            document.body.append(oauthDiv);
            const OAuthServices = await fetch(`${Env_3.default.API_ORIGIN}auth/services`, {})
                .then(response => response.json());
            for (const service of Object.values(OAuthServices.data)) {
                const oauthButton = document.createElement("button");
                oauthButton.textContent = `OAuth ${service.name}`;
                oauthDiv.append(oauthButton);
                oauthButton.addEventListener("click", async () => {
                    await (0, Popup_1.default)(service.url_begin, 600, 900)
                        .then(() => true).catch(err => { console.warn(err); return false; });
                    await Session_2.default.refresh();
                });
                const unoauthbutton = document.createElement("button");
                unoauthbutton.textContent = `UnOAuth ${service.name}`;
                oauthDiv.append(unoauthbutton);
                unoauthbutton.addEventListener("click", async () => {
                    const id = Session_2.default.getAuthServices()[service.id]?.[0]?.id;
                    if (id === undefined)
                        return;
                    await fetch(`${Env_3.default.API_ORIGIN}auth/remove`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id }),
                    });
                });
            }
            // document.body.append(createButton(BUTTON_REGISTRY.createAuthor, "test author 1", "hi-im-an-author"));
            oauthDiv.append(createButton(ButtonRegistry_1.BUTTON_REGISTRY.clearSession));
            const profileButtons = document.createElement("div");
            document.body.append(profileButtons);
            profileButtons.append(createButton({
                name: "Create Profile 1",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.createAuthor.execute("prolific author", "somanystories");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("a debut work", "pretty decent", "debut", "Complete", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("chapter 1", "woo look it's prolific author's first story!", "debut", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("sequel to debut", "wow they wrote a sequel", "sequel", "Ongoing", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("the chapters", "pretend there's a story here", "sequel", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("work in progress", "private test", "wip", "Ongoing", "Private");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("draft", "it's a rough draft", "wip", "Private");
                },
            }));
            profileButtons.append(createButton({
                name: "View Profile 1",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewAuthor.execute("author with many stories", "somanystories");
                },
            }));
            profileButtons.append(createButton({
                name: "Create Profile 2",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.createAuthor.execute("single story author", "justonestory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("one big work", "it's long", "bigstory", "Ongoing", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("big story", "start of a long story", "bigstory", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("big story 2", "middle of a long story", "bigstory", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("big story 3", "aaaa", "bigstory", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("big story 4", "aaaaaaa", "bigstory", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("big story 5", "aaaaaaaaaaaaaaaaaaa", "bigstory", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewWork.execute("big story five chapters", "bigstory");
                    // await BUTTON_REGISTRY.follow.execute("work", "debut");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("tried a new story", "test thing", "anotherstory", "Hiatus", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewWork.execute("on creation 0 chapters", "anotherstory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("chapter one", "some chapter data", "anotherstory", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createChapter.execute("chapter two", "some chapter data", "anotherstory", "Private");
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewWork.execute("one public one private", "anotherstory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.updateChapter.execute("anotherstory", 2, undefined, undefined, "Patreon");
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewWork.execute("one public one patreon", "anotherstory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.deleteChapter.execute("anotherstory", 2);
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewWork.execute("delete second chapter", "anotherstory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.deleteChapter.execute("anotherstory", 1);
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewWork.execute("delete first chapter", "anotherstory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.deleteWork.execute("anotherstory");
                },
            }));
            profileButtons.append(createButton({
                name: "View Profile 2",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewAuthor.execute("justonestory author", "justonestory");
                },
            }));
            profileButtons.append(createButton({
                name: "Create Profile 3",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.createAuthor.execute("prolific follower", "ifollowpeople");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("author", "somanystories");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("author", "justonestory");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", "debut");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", "sequel");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", "wip");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", "bigstory");
                },
            }));
            profileButtons.append(createButton({
                name: "View Profile 3",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.viewAuthor.execute("ifollowpeople author", "ifollowpeople");
                },
            }));
            const testButtons = document.createElement("div");
            document.body.append(testButtons);
            testButtons.append(createButton({
                name: "Test New Following",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.createAuthor.execute("new follows", "thefollower");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("wow a work", "test pls ignore", "wowawork", "Ongoing", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("author", "thefollower");
                    await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", "wowawork");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getFollow.execute("author", "thefollower");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllFollows.execute("work");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllFollowsMerged.execute();
                    await ButtonRegistry_1.BUTTON_REGISTRY.unignore.execute("work", "wowawork");
                    // await BUTTON_REGISTRY.unfollow.execute("work", "wowawork");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getFollow.execute("work", "wowawork");
                },
            }));
            // testButtons.append(createButton({
            // 	name: "Test Following Private Works",
            // 	async execute () {
            // 		await BUTTON_REGISTRY.createWork.execute("private from start", "aaaaaaa", "story1", "Ongoing", "Private");
            // 		await BUTTON_REGISTRY.createChapter.execute("aaaaa", "aaaaaaa", "story1", "Private");
            // 		await BUTTON_REGISTRY.follow.execute("work", "story1");
            // 		await BUTTON_REGISTRY.getFollow.execute("work", "story1");
            // 		await BUTTON_REGISTRY.getAllFollows.execute("work");
            // 		await BUTTON_REGISTRY.getAllFollowsMerged.execute();
            // 	},
            // }));
            // testButtons.append(createButton({
            // 	name: "Test Following Works Made Private",
            // 	async execute () {
            // 		await BUTTON_REGISTRY.createWork.execute("made private later", "bbbbbbbb", "story2", "Ongoing", "Public");
            // 		await BUTTON_REGISTRY.createChapter.execute("bbbbbb", "bbbbbbbb", "story2", "Public");
            // 		await BUTTON_REGISTRY.follow.execute("work", "story2");
            // 		await BUTTON_REGISTRY.getFollow.execute("work", "story2");
            // 		await BUTTON_REGISTRY.getAllFollows.execute("work");
            // 		await BUTTON_REGISTRY.getAllFollowsMerged.execute();
            // 		await BUTTON_REGISTRY.updateWork.execute("story2", undefined, undefined, undefined, undefined, "Private");
            // 		await BUTTON_REGISTRY.viewWork.execute("story2");
            // 		await BUTTON_REGISTRY.getFollow.execute("work", "story2");
            // 		await BUTTON_REGISTRY.getAllFollows.execute("work");
            // 		await BUTTON_REGISTRY.getAllFollowsMerged.execute();
            // 	},
            // }));
            testButtons.append(createButton({
                name: "Create 40 works",
                async execute() {
                    for (let i = 0; i < 30; i++) {
                        await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute(`test story ${i}`, "aaaaaaaaa", `teststory${i}`, "Ongoing", "Public");
                    }
                    for (let i = 0; i < 30; i++) {
                        await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", `teststory${i}`);
                    }
                },
            }));
            testButtons.append(createButton({
                name: "Follows testing",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllFollows.execute("work", 0);
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllFollows.execute("work", 1);
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllFollowsMerged.execute(0);
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllFollowsMerged.execute(1);
                },
            }));
            testButtons.append(createButton({
                name: "Spam Create Follow Work Test",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.createAuthor.execute("spam create works", "manyworks");
                    for (let i = 0; i < 100; i++) {
                        await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute(`rapid story ${i}`, "aaaaaaaaa", `rapidstory${i}`, "Ongoing", "Public");
                        await ButtonRegistry_1.BUTTON_REGISTRY.follow.execute("work", `rapidstory${i}`);
                    }
                },
            }));
            testButtons.append(createButton({
                name: "Test Ignore Endpoints",
                async execute() {
                    await ButtonRegistry_1.BUTTON_REGISTRY.createAuthor.execute("ignoring myself", "ignorepls");
                    await ButtonRegistry_1.BUTTON_REGISTRY.createWork.execute("to ignore", "testing ignoring", "worktoignore", "Ongoing", "Public");
                    await ButtonRegistry_1.BUTTON_REGISTRY.ignore.execute("author", "ignorepls");
                    await ButtonRegistry_1.BUTTON_REGISTRY.ignore.execute("work", "worktoignore");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getIgnore.execute("author", "ignorepls");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getIgnore.execute("work", "worktoignore");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllIgnores.execute("author");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllIgnores.execute("work");
                    await ButtonRegistry_1.BUTTON_REGISTRY.getAllIgnoresMerged.execute();
                },
            }));
        }
    }
    exports.default = Fluff4me;
});
define("utility/Define", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Define(proto, key, implementation) {
        try {
            Object.defineProperty(proto, key, {
                configurable: true,
                writable: true,
                value: implementation,
            });
        }
        catch (err) {
        }
    }
    (function (Define) {
        function all(protos, key, implementation) {
            for (const proto of protos) {
                Define(proto, key, implementation);
            }
        }
        Define.all = all;
        function magic(obj, key, implementation) {
            try {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    ...implementation,
                });
            }
            catch (err) {
            }
        }
        Define.magic = magic;
    })(Define || (Define = {}));
    exports.default = Define;
});
define("utility/Arrays", ["require", "exports", "utility/Define"], function (require, exports, Define_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Arrays;
    (function (Arrays) {
        Arrays.EMPTY = [];
        function resolve(or) {
            return Array.isArray(or) ? or : or === undefined ? [] : [or];
        }
        Arrays.resolve = resolve;
        function includes(array, value) {
            return Array.isArray(array) ? array.includes(value) : array === value;
        }
        Arrays.includes = includes;
        function slice(or) {
            return Array.isArray(or) ? or.slice() : or === undefined ? [] : [or];
        }
        Arrays.slice = slice;
        /**
         * Removes one instance of the given value from the given array.
         * @returns `true` if removed, `false` otherwise
         */
        function remove(array, ...values) {
            if (!array)
                return false;
            let removed = false;
            for (const value of values) {
                const index = array.indexOf(value);
                if (index === -1)
                    continue;
                array.splice(index, 1);
                removed = true;
            }
            return removed;
        }
        Arrays.remove = remove;
        /**
         * Adds the given value to the given array if not present.
         * @returns `true` if added, `false` otherwise
         */
        function add(array, value) {
            if (!array)
                return false;
            const index = array.indexOf(value);
            if (index !== -1)
                return false;
            array.push(value);
            return true;
        }
        Arrays.add = add;
        function tuple(...values) {
            return values;
        }
        Arrays.tuple = tuple;
        function range(start, end, step) {
            if (step === 0)
                throw new Error("Invalid step for range");
            const result = [];
            if (end === undefined)
                end = start, start = 0;
            step = end < start ? -1 : 1;
            for (let i = start; step > 0 ? i < end : i > end; i += step)
                result.push(i);
            return result;
        }
        Arrays.range = range;
        function filterNullish(value) {
            return value !== null && value !== undefined;
        }
        Arrays.filterNullish = filterNullish;
        function filterFalsy(value) {
            return !!value;
        }
        Arrays.filterFalsy = filterFalsy;
        function mergeSorted(...arrays) {
            return arrays.reduce((prev, curr) => mergeSorted2(prev, curr), []);
        }
        Arrays.mergeSorted = mergeSorted;
        function mergeSorted2(array1, array2) {
            const merged = [];
            let index1 = 0;
            let index2 = 0;
            while (index1 < array1.length || index2 < array2.length) {
                const v1 = index1 < array1.length ? array1[index1] : undefined;
                const v2 = index2 < array2.length ? array2[index2] : undefined;
                if (v1 === v2) {
                    merged.push(v1);
                    index1++;
                    index2++;
                    continue;
                }
                if (v1 === undefined && v2 !== undefined) {
                    merged.push(v2);
                    index2++;
                    continue;
                }
                if (v2 === undefined && v1 !== undefined) {
                    merged.push(v1);
                    index1++;
                    continue;
                }
                const indexOfPerson1InList2 = array2.indexOf(v1, index2);
                if (indexOfPerson1InList2 === -1) {
                    merged.push(v1);
                    index1++;
                }
                else {
                    merged.push(v2);
                    index2++;
                }
            }
            return merged;
        }
        function applyPrototypes() {
            (0, Define_1.default)(Array.prototype, "findLast", function (predicate) {
                if (this.length > 0)
                    for (let i = this.length - 1; i >= 0; i--)
                        if (predicate(this[i], i, this))
                            return this[i];
                return undefined;
            });
            (0, Define_1.default)(Array.prototype, "findLastIndex", function (predicate) {
                if (this.length > 0)
                    for (let i = this.length - 1; i >= 0; i--)
                        if (predicate(this[i], i, this))
                            return i;
                return -1;
            });
            const originalSort = Array.prototype.sort;
            (0, Define_1.default)(Array.prototype, "sort", function (...sorters) {
                if (this.length <= 1)
                    return this;
                if (!sorters.length)
                    return originalSort.call(this);
                return originalSort.call(this, (a, b) => {
                    for (const sorter of sorters) {
                        if (sorter.length === 1) {
                            const mapper = sorter;
                            const sortValue = mapper(b) - mapper(a);
                            if (sortValue)
                                return sortValue;
                        }
                        else {
                            const sortValue = sorter(a, b);
                            if (sortValue)
                                return sortValue;
                        }
                    }
                    return 0;
                });
            });
            (0, Define_1.default)(Array.prototype, "collect", function (collector, ...args) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return collector?.(this, ...args);
            });
            (0, Define_1.default)(Array.prototype, "splat", function (collector, ...args) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return collector?.(...this, ...args);
            });
            (0, Define_1.default)(Array.prototype, "toObject", function (mapper) {
                return Object.fromEntries(mapper ? this.map(mapper) : this);
            });
            (0, Define_1.default)(Array.prototype, "distinct", function (mapper) {
                const result = [];
                const encountered = mapper ? [] : result;
                for (const value of this) {
                    const encounterValue = mapper ? mapper(value) : value;
                    if (encountered.includes(encounterValue))
                        continue;
                    if (mapper)
                        encountered.push(encounterValue);
                    result.push(value);
                }
                return result;
            });
            (0, Define_1.default)(Array.prototype, "findMap", function (predicate, mapper) {
                for (let i = 0; i < this.length; i++)
                    if (predicate(this[i], i, this))
                        return mapper(this[i], i, this);
                return undefined;
            });
            (0, Define_1.default)(Array.prototype, "groupBy", function (grouper) {
                const result = {};
                for (let i = 0; i < this.length; i++)
                    (result[String(grouper(this[i], i, this))] ??= []).push(this[i]);
                return Object.entries(result);
            });
        }
        Arrays.applyPrototypes = applyPrototypes;
    })(Arrays || (Arrays = {}));
    exports.default = Arrays;
});
define("utility/DOMRect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1() {
        Object.defineProperty(DOMRect.prototype, "centerX", {
            get() {
                return this.left + this.width / 2;
            },
        });
        Object.defineProperty(DOMRect.prototype, "centerY", {
            get() {
                return this.top + this.height / 2;
            },
        });
    }
    exports.default = default_1;
});
define("index", ["require", "exports", "Fluff4me", "utility/Arrays", "utility/DOMRect"], function (require, exports, Fluff4me_1, Arrays_1, DOMRect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (0, DOMRect_1.default)();
    Arrays_1.default.applyPrototypes();
    new Fluff4me_1.default();
});
define("utility/Type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("utility/Objects", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Objects;
    (function (Objects) {
        Objects.EMPTY = {};
        function inherit(obj, inherits) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            Object.setPrototypeOf(obj, inherits.prototype);
            return obj;
        }
        Objects.inherit = inherit;
        function map(object, mapper) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion
            return Object.fromEntries(Object.entries(object).map(mapper));
        }
        Objects.map = map;
        async function mapAsync(object, mapper) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return Object.fromEntries(await Promise.all(Object.entries(object).map(mapper)));
        }
        Objects.mapAsync = mapAsync;
        function followPath(obj, keys) {
            for (const key of keys)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                obj = obj?.[key];
            return obj;
        }
        Objects.followPath = followPath;
        function applyJIT(obj, key, compute) {
            const get = (() => {
                const promise = compute();
                delete obj[key];
                obj[key] = promise;
                if (promise instanceof Promise)
                    void promise.then(value => obj[key] = value);
                return promise;
            });
            get.compute = compute;
            Object.defineProperty(obj, key, {
                configurable: true,
                get,
            });
        }
        Objects.applyJIT = applyJIT;
        function copyJIT(target, from, key) {
            const descriptor = Object.getOwnPropertyDescriptor(from, key);
            if (!descriptor)
                return;
            if ("value" in descriptor) {
                target[key] = from[key];
                return;
            }
            const compute = descriptor.get?.compute;
            if (!compute)
                return;
            applyJIT(target, key, compute);
        }
        Objects.copyJIT = copyJIT;
    })(Objects || (Objects = {}));
    exports.default = Objects;
});
define("utility/Store", ["require", "exports", "utility/EventManager"], function (require, exports, EventManager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let storage;
    class Store {
        static get items() {
            return storage ??= new Proxy({}, {
                has(_, key) {
                    return Store.has(key);
                },
                get(_, key) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return Store.get(key);
                },
                set(_, key, value) {
                    return Store.set(key, value);
                },
                deleteProperty(_, key) {
                    return Store.delete(key);
                },
            });
        }
        static has(key) {
            return localStorage.getItem(key) !== null;
        }
        static get(key) {
            const value = localStorage.getItem(key);
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return value === null ? null : JSON.parse(value);
            }
            catch {
                localStorage.removeItem(key);
                return null;
            }
        }
        static set(key, value) {
            const oldValue = Store.get(key);
            if (value === undefined)
                localStorage.removeItem(key);
            else
                localStorage.setItem(key, JSON.stringify(value));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            Store.event.emit(`set${key[0].toUpperCase()}${key.slice(1)}`, { value, oldValue });
            return true;
        }
        static delete(key) {
            const oldValue = Store.get(key);
            localStorage.removeItem(key);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            Store.event.emit(`delete${key[0].toUpperCase()}${key.slice(1)}`, { oldValue });
            return true;
        }
    }
    Store.event = EventManager_2.EventManager.make();
    exports.default = Store;
});
define("utility/Database", ["require", "exports", "utility/Arrays", "utility/EventManager", "utility/Objects", "utility/Store"], function (require, exports, Arrays_2, EventManager_3, Objects_1, Store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Version;
    (function (Version) {
        function encode(...[major, minor]) {
            return (Math.min(major, 2 ** 16) << 16) | Math.min(minor, 2 ** 16);
        }
        Version.encode = encode;
        function decode(encoded) {
            return [encoded >> 16, encoded & 65535];
        }
        Version.decode = decode;
    })(Version || (Version = {}));
    class Database {
        async getDatabase() {
            if (this.database)
                return this.database;
            return this.open();
        }
        constructor(schema) {
            this.schema = schema;
            this.event = new EventManager_3.EventManager(this);
        }
        async get(store, key, index) {
            return this.transaction([store], "readonly", transaction => transaction.get(store, key, index));
        }
        async all(store, rangeOrKey, index) {
            return this.transaction([store], "readonly", transaction => transaction.all(store, rangeOrKey, index));
        }
        async set(store, key, value) {
            return this.transaction([store], transaction => transaction.set(store, key, value));
        }
        async delete(store, key) {
            return this.transaction([store], transaction => transaction.delete(store, key));
        }
        async keys(store) {
            return this.transaction([store], "readonly", transaction => transaction.keys(store));
        }
        async count(store) {
            return this.transaction([store], "readonly", transaction => transaction.count(store));
        }
        async clear(store) {
            return this.transaction([store], transaction => transaction.clear(store));
        }
        async transaction(over, modeOrTransaction, transaction) {
            if (typeof modeOrTransaction !== "string") {
                transaction = modeOrTransaction;
                modeOrTransaction = "readwrite";
            }
            const database = await this.getDatabase();
            const instance = new Database.Transaction(database.transaction(over, modeOrTransaction));
            const result = await transaction(instance);
            await instance.commit();
            return result;
        }
        stagedTransaction(over, mode = "readwrite") {
            return new Database.StagedTransaction(this, over, mode);
        }
        async upgrade(upgrade) {
            await this.close();
            const [, databaseVersionMinor] = (await this.getVersion()) ?? [];
            await this.open((databaseVersionMinor ?? 0) + 1, upgrade);
        }
        async stores() {
            const database = await this.getDatabase();
            return database.objectStoreNames;
        }
        async hasStore(...stores) {
            const database = await this.getDatabase();
            return stores.every(store => database.objectStoreNames.contains(store));
        }
        async createStore(store, options, init) {
            if (await this.hasStore(store))
                return;
            await this.upgrade(async (upgrade) => {
                await init?.(upgrade.createObjectStore(store, options));
            });
        }
        async dispose() {
            await this.close();
            return new Promise((resolve, reject) => {
                const request = indexedDB.deleteDatabase(this.schema.id);
                request.addEventListener("success", () => resolve());
                request.addEventListener("blocked", () => reject(new Error(`Cannot delete database '${this.schema.id}', blocked`)));
                request.addEventListener("error", () => reject(new Error(`Cannot delete database '${this.schema.id}', error: ${request.error?.message ?? "Unknown error"}`)));
            });
        }
        getVersion() {
            // const databaseInfo = (await indexedDB.databases()).find(({ name }) => name === this.schema.id);
            const databaseInfo = Store_1.default.items.databases?.find(({ name }) => name === this.schema.id);
            return databaseInfo?.version ? Version.decode(databaseInfo.version) : undefined;
        }
        async open(versionMinor, upgrade) {
            if (!this.schema.versions.length)
                throw new Error(`No versions in schema for database '${this.schema.id}'`);
            // eslint-disable-next-line @typescript-eslint/no-misused-promises,  no-async-promise-executor
            const databasePromise = new Promise(async (resolve, reject) => {
                const [, databaseVersionMinor] = (await this.getVersion()) ?? [];
                const newVersion = Version.encode(this.schema.versions.length, versionMinor ?? databaseVersionMinor ?? 0);
                const request = indexedDB.open(this.schema.id, newVersion);
                request.addEventListener("blocked", () => {
                    console.log("blocked");
                });
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                request.addEventListener("upgradeneeded", async (event) => {
                    const transaction = request.transaction;
                    if (!transaction)
                        return;
                    const database = request.result;
                    const [versionMajor] = Version.decode(event.newVersion ?? newVersion);
                    const [oldVersionMajor] = Version.decode(event.oldVersion);
                    for (let i = oldVersionMajor; i < versionMajor; i++)
                        await this.schema.versions[i](database, transaction);
                    await upgrade?.(database, transaction);
                    const databases = Store_1.default.items.databases ?? [];
                    const databaseInfo = databases.find(({ name }) => name === this.schema.id);
                    if (databaseInfo)
                        databaseInfo.version = newVersion;
                    else
                        databases.push({ name: this.schema.id, version: newVersion });
                    Store_1.default.items.databases = databases;
                });
                request.addEventListener("error", () => {
                    console.log("aaaaaaaaaaaaaaaaaaaa");
                    if (request.error?.message.includes("version")) {
                        console.info(`Database '${this.schema.id}' is from the future and must be disposed`);
                        delete this.database;
                        void this.dispose().then(() => {
                            resolve(this.open(versionMinor, upgrade));
                        });
                        return;
                    }
                    reject(new Error(`Cannot create database '${this.schema.id}', error: ${request.error?.message ?? "Unknown error"}`));
                });
                request.addEventListener("success", () => resolve(request.result));
            });
            this.database = databasePromise;
            const database = await databasePromise;
            database.addEventListener("close", () => {
                delete this.database;
                this.event.emit("close");
            });
            this.database = database;
            this.event.emit("open");
            return database;
        }
        async close() {
            if (!this.database)
                return;
            const database = this.database;
            delete this.database;
            (await database).close();
        }
    }
    (function (Database) {
        function schema(id, ...versions) {
            return {
                _schema: null,
                id,
                versions,
            };
        }
        Database.schema = schema;
        class Transaction {
            constructor(transaction) {
                this.transaction = transaction;
                this.event = new EventManager_3.EventManager(this);
                this.complete = false;
                this.errored = false;
                this.transaction.addEventListener("complete", () => {
                    this.complete = true;
                    this.event.emit("complete");
                });
                this.transaction.addEventListener("error", () => {
                    this.errored = true;
                    this.event.emit("error", { error: this.transaction.error });
                });
            }
            async get(name, key, index) {
                return this.do(() => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    let store = this.transaction.objectStore(name);
                    if (index !== undefined)
                        store = store.index(index);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return store.get(key);
                });
            }
            async all(name, rangeOrKey, index) {
                if (Array.isArray(rangeOrKey)) {
                    return new Promise((resolve, reject) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        let store = this.transaction.objectStore(name);
                        if (index !== undefined)
                            store = store.index(index);
                        const result = [];
                        const request = store.openCursor();
                        request.addEventListener("error", () => reject(request.error));
                        request.addEventListener("success", event => {
                            const cursor = request.result;
                            if (!cursor)
                                return resolve(result);
                            if (rangeOrKey.includes(cursor.key) || (!isNaN(+cursor.key) && rangeOrKey.includes(+cursor.key)))
                                result.push(cursor.value);
                            cursor.continue();
                        });
                    });
                }
                return this.do(() => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    let store = this.transaction.objectStore(name);
                    if (index !== undefined)
                        store = store.index(index);
                    if (typeof rangeOrKey === "string")
                        return store.getAll(rangeOrKey);
                    return store.getAll(rangeOrKey);
                });
            }
            async primaryKeys(name, rangeOrKey, index) {
                return this.do(() => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    let store = this.transaction.objectStore(name);
                    if (index !== undefined)
                        store = store.index(index);
                    return store.getAllKeys(rangeOrKey);
                });
            }
            async indexKeys(name, index, mapper) {
                return new Promise((resolve, reject) => {
                    const store = this.transaction.objectStore(name).index(index);
                    const regexDot = /\./g;
                    const keyPath = Arrays_2.default.resolve(store.keyPath)
                        .flatMap(key => key.split(regexDot));
                    const result = new Map();
                    const request = store.openCursor();
                    request.addEventListener("error", () => reject(request.error));
                    request.addEventListener("success", event => {
                        const cursor = request.result;
                        if (!cursor)
                            return resolve([...result.values()]);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const key = Objects_1.default.followPath(cursor.value, keyPath);
                        if ((typeof key === "string" || typeof key === "number") && !result.has(key))
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            result.set(key, !mapper ? key : mapper(key, cursor.value));
                        cursor.continue();
                    });
                });
            }
            async set(name, key, value) {
                return this.do(() => this.transaction.objectStore(name)
                    .put(value, key))
                    .then(() => { });
            }
            async delete(name, key) {
                return this.do(() => this.transaction.objectStore(name)
                    .delete(key));
            }
            async keys(name) {
                return this.do(() => this.transaction.objectStore(name)
                    .getAllKeys());
            }
            async count(name) {
                return this.do(() => this.transaction.objectStore(name)
                    .count());
            }
            async clear(name) {
                return this.do(() => this.transaction.objectStore(name)
                    .clear());
            }
            async do(operation) {
                if (this.errored || this.complete)
                    throw new Error("Transaction is complete or has errored, no further operations are allowed");
                return new Promise((resolve, reject) => {
                    const request = operation();
                    request.addEventListener("error", () => reject(request.error));
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    request.addEventListener("success", () => resolve(request.result));
                });
            }
            async commit() {
                if (this.complete || this.errored)
                    return;
                this.complete = true;
                this.transaction.commit();
                return this.event.waitFor("complete");
            }
        }
        Database.Transaction = Transaction;
        class StagedTransaction {
            constructor(database, over, mode) {
                this.database = database;
                this.over = over;
                this.mode = mode;
                this.pending = [];
            }
            queue(staged) {
                const resultPromise = new Promise(resolve => {
                    if (typeof staged === "function")
                        this.pending.push(async (transaction) => resolve(await staged(transaction, ...[])));
                    else {
                        staged.resolve = resolve;
                        this.pending.push(staged);
                    }
                });
                void this.tryExhaustQueue();
                return resultPromise;
            }
            async tryExhaustQueue() {
                if (this.activeTransaction)
                    return this.activeTransaction;
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                this.activeTransaction = (async () => {
                    while (this.pending.length) {
                        const transactions = this.pending.splice(0, Infinity);
                        console.debug(`Found ${transactions.length} staged transactions over:`, ...this.over);
                        const start = performance.now();
                        await this.database.transaction(this.over, this.mode, async (transaction) => {
                            const transactionsByType = {};
                            for (const staged of transactions) {
                                if (typeof staged === "function") {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                    await staged(transaction);
                                    continue;
                                }
                                transactionsByType[staged.id] ??= [];
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                transactionsByType[staged.id].push(staged);
                            }
                            for (const transactions of Object.values(transactionsByType)) {
                                const data = transactions.flatMap(staged => staged.data);
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                const results = await transactions[0].function(transaction, ...data);
                                if (results.length !== data.length)
                                    throw new Error(`Invalid number of results for ${transactions[0].id} over ${this.over.join(", ")}`);
                                for (let i = 0; i < results.length; i++) {
                                    transactions[i].resolve(results[i]);
                                }
                            }
                        });
                        console.debug(`Completed ${transactions.length} staged transactions in ${performance.now() - start}ms over:`, ...this.over);
                    }
                })();
                await this.activeTransaction;
                delete this.activeTransaction;
            }
            await() {
                return this.tryExhaustQueue();
            }
            async transaction(initialiser) {
                return this.queue(transaction => initialiser(transaction));
            }
            async get(store, key, index) {
                return this.queue(transaction => transaction.get(store, key, index));
                // return this.queue({
                // 	id: `get:${String(store)}:${index ?? "/"}`,
                // 	data: [key],
                // 	function: async (transaction, ...data) =>
                // 		data.length === 1 ? [await transaction.get(store, key, index)]
                // 			: transaction.all(store, data, index),
                // });
            }
            async all(store, range, index) {
                return this.queue(transaction => transaction.all(store, range, index));
            }
            async primaryKeys(store, range, index) {
                return this.queue(transaction => transaction.primaryKeys(store, range, index));
            }
            async indexKeys(store, index, mapper) {
                return this.queue(transaction => transaction.indexKeys(store, index, mapper));
            }
            async set(store, key, value) {
                if (this.mode === "readonly")
                    throw new Error("Cannot modify store in readonly mode");
                return this.queue(transaction => transaction.set(store, key, value));
            }
            async delete(store, key) {
                if (this.mode === "readonly")
                    throw new Error("Cannot modify store in readonly mode");
                return this.queue(transaction => transaction.delete(store, key));
            }
            async keys(store) {
                return this.queue(transaction => transaction.keys(store));
            }
            async count(store) {
                return this.queue(transaction => transaction.count(store));
            }
            async clear(store) {
                if (this.mode === "readonly")
                    throw new Error("Cannot modify store in readonly mode");
                return this.queue(transaction => transaction.clear(store));
            }
        }
        Database.StagedTransaction = StagedTransaction;
    })(Database || (Database = {}));
    exports.default = Database;
});
define("model/ModelCacheDatabase", ["require", "exports", "utility/Database"], function (require, exports, Database_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Database_1.default.schema("modelCache", database => {
        database.createObjectStore("models");
    });
});
define("utility/maths/Maths", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Maths;
    (function (Maths) {
        function sum(...nums) {
            let result = 0;
            for (const num of nums)
                result += num;
            return result;
        }
        Maths.sum = sum;
        function average(...nums) {
            let result = 0;
            for (const num of nums)
                result += num;
            return result / nums.length;
        }
        Maths.average = average;
        function bits(number) {
            const result = new BitsSet();
            for (let i = 52; i >= 0; i--) {
                const v = 1 << i;
                if (number & v)
                    result.add(v);
            }
            return result;
        }
        Maths.bits = bits;
        class BitsSet extends Set {
            everyIn(type) {
                const t = type ?? 0;
                for (const bit of this)
                    if (!(t & bit))
                        return false;
                return true;
            }
            someIn(type) {
                const t = type ?? 0;
                for (const bit of this)
                    if (t & bit)
                        return true;
                return false;
            }
            every(predicate) {
                for (const bit of this)
                    if (!predicate(bit))
                        return false;
                return true;
            }
            some(predicate) {
                for (const bit of this)
                    if (predicate(bit))
                        return true;
                return false;
            }
        }
        Maths.BitsSet = BitsSet;
        function bitsn(flag) {
            const result = new BitsSetN();
            for (let i = 52n; i >= 0n; i--) {
                const v = 1n << i;
                if (flag & v)
                    result.add(v);
            }
            return result;
        }
        Maths.bitsn = bitsn;
        class BitsSetN extends Set {
            everyIn(type) {
                const t = type ?? 0n;
                for (const bit of this)
                    if (!(t & bit))
                        return false;
                return true;
            }
            someIn(type) {
                const t = type ?? 0n;
                for (const bit of this)
                    if (t & bit)
                        return true;
                return false;
            }
            every(predicate) {
                for (const bit of this)
                    if (!predicate(bit))
                        return false;
                return true;
            }
            some(predicate) {
                for (const bit of this)
                    if (predicate(bit))
                        return true;
                return false;
            }
        }
        Maths.BitsSetN = BitsSetN;
        function lerp(from, to, t) {
            return (1 - t) * from + t * to;
        }
        Maths.lerp = lerp;
    })(Maths || (Maths = {}));
    exports.default = Maths;
});
define("model/Model", ["require", "exports", "model/ModelCacheDatabase", "utility/Arrays", "utility/Database", "utility/EventManager", "utility/maths/Maths"], function (require, exports, ModelCacheDatabase_1, Arrays_3, Database_2, EventManager_4, Maths_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Model;
    (function (Model) {
        Model.cacheDB = new Database_2.default(ModelCacheDatabase_1.default);
        Model.event = EventManager_4.EventManager.make();
        let loadId = Date.now();
        async function clearCache(force = false) {
            console.warn("Clearing cache...");
            loadId = Date.now();
            if (force) {
                await Model.cacheDB.dispose();
                console.warn("Cache cleared.");
                Model.event.emit("clearCache");
                return;
            }
            for (const store of (await Model.cacheDB.stores())) {
                if (store === "models") {
                    for (const key of await Model.cacheDB.keys("models")) {
                        const cached = await Model.cacheDB.get("models", key);
                        if (cached?.persist && !force)
                            continue;
                        await Model.cacheDB.delete("models", key);
                    }
                }
                else if (force) {
                    await Model.cacheDB.clear(store);
                }
            }
            console.warn("Cache cleared.");
            Model.event.emit("clearCache");
        }
        Model.clearCache = clearCache;
        /**
         * Custom model implementation
         */
        function create(name, model) {
            return new Impl(name, model);
        }
        Model.create = create;
        /**
         * Data not cached, with optional name
         */
        function createTemporary(generate, name = "") {
            return new Impl(name, {
                cache: false,
                generate,
            });
        }
        Model.createTemporary = createTemporary;
        /**
         * Data cached only in memory, with optional reset time & name
         */
        function createDynamic(resetTime, generate, name = "") {
            return new Impl(name, {
                cache: "Memory",
                resetTime,
                generate,
            });
        }
        Model.createDynamic = createDynamic;
        class Impl {
            async getModelVersion() {
                this.modelVersion ??= (await (typeof this.model.version === "function" ? this.model.version() : this.model.version)) ?? 0;
                return this.modelVersion;
            }
            getCacheTime() {
                return this.cacheTime ?? Date.now();
            }
            get loading() {
                return this.value === undefined
                    || this.value instanceof Promise
                    || (this.model.cache ? !this.isCacheValid() : false);
            }
            get loadingInfo() {
                return this._loadingInfo;
            }
            get latest() {
                return this._latest;
            }
            constructor(name, model) {
                this.name = name;
                this.model = model;
                this.event = new EventManager_4.EventManager(this);
                this.loadId = loadId;
                this.errored = false;
                Object.assign(this, model.api);
            }
            isCacheValid(cacheTime = this.cacheTime, version = this.version, resetTime = this.model.resetTime) {
                if (cacheTime === undefined)
                    return false;
                if (this.loadId !== loadId)
                    return false;
                if (this.modelVersion === undefined || this.modelVersion !== version)
                    return false;
                if (!this.model.cache)
                    return false;
                if (resetTime === undefined)
                    return true;
                return Date.now() < cacheTime + resetTime;
            }
            async resolveCache(includeExpired = false) {
                if (!this.model.cache || this.model.cache === "Memory")
                    return undefined;
                const cached = await Model.cacheDB.get("models", this.name);
                if (!cached)
                    return undefined;
                await this.getModelVersion();
                if (includeExpired === true || this.isCacheValid(cached.cacheTime, cached.version, includeExpired === "initial" ? this.model.useCacheOnInitial : undefined)) {
                    // this cached value is valid
                    console.debug(`Using cached data for '${this.name}', cached at ${new Date(cached.cacheTime).toLocaleString()}`);
                    this._latest = this.value = (this.model.process?.(cached.value) ?? cached.value ?? null);
                    this.cacheTime = cached.cacheTime;
                    this.version = cached.version;
                    this.event.emit("loaded", { value: this.value ?? undefined });
                    return this.value ?? undefined;
                }
                // we don't purge the data anymore so that we can show your last loaded data even if the api is down
                // console.debug(`Purging expired cache data for '${this.name}'`);
                // await this.reset();
                this.model.cacheInvalidated?.(cached.value);
                this.event.emit("invalidCache");
                return undefined;
            }
            async reset(value) {
                if (!this.model.reset)
                    this._latest = this.value = value = undefined;
                else {
                    if (!value) {
                        const cached = await Model.cacheDB.get("models", this.name);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        value = cached?.value;
                    }
                    await this.model.reset?.(value);
                }
                await Model.cacheDB.delete("models", this.name);
                delete this.modelVersion;
                await this.getModelVersion();
            }
            get() {
                if (this.value !== undefined && !(this.value instanceof Promise))
                    if (!this.isCacheValid())
                        delete this.value;
                if (this.value === undefined || this.errored) {
                    if (this.name)
                        console.debug(`No value in memory for '${this.name}'`);
                    this.event.emit("loading");
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
                    const promise = new Promise(async (resolve, reject) => {
                        if (this.model.cache && this.model.cache !== "Memory") {
                            const cached = await this.resolveCache();
                            if (cached)
                                return resolve(cached);
                        }
                        if (!this.model.generate)
                            // this model can't be generated on its own, it must be initialised instead
                            // in this case, wait for the loaded event and return the new value
                            return resolve(this.event.waitFor("loaded")
                                .then(({ value }) => value));
                        const subscriptions = new Map();
                        let lastMessage = [];
                        const api = {
                            setCacheTime: (cacheTimeSupplier) => this.getCacheTime = cacheTimeSupplier,
                            emitProgress: (progress, messages, bubbled = false) => {
                                messages = Arrays_3.default.resolve(messages);
                                this._loadingInfo = { progress, messages };
                                // console.debug(`Load progress ${Math.floor(progress * 100)}%: ${messages.join(" ") || "Loading"}`);
                                if (!bubbled) {
                                    lastMessage = messages;
                                    for (const [model, handleSubUpdate] of [...subscriptions]) {
                                        model.event.unsubscribe("loadUpdate", handleSubUpdate);
                                        subscriptions.delete(model);
                                    }
                                }
                                this.event.emit("loadUpdate", { progress, messages });
                            },
                            subscribeProgress: (model, amount, from = 0) => {
                                if (model.loading) {
                                    if (subscriptions.has(model))
                                        return api;
                                    const handleSubUpdate = ({ progress: subAmount, messages }) => 
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                                    api.emitProgress(from + subAmount * amount, [...messages, ...lastMessage].filter(m => m), true);
                                    model.event.subscribe("loadUpdate", handleSubUpdate);
                                    subscriptions.set(model, handleSubUpdate);
                                    model.event.subscribeOnce("loaded", () => {
                                        model.event.unsubscribe("loadUpdate", handleSubUpdate);
                                        subscriptions.delete(model);
                                    });
                                }
                                return api;
                            },
                            subscribeProgressAndWait: (model, amount, from) => {
                                api.subscribeProgress(model, amount, from);
                                return model.await();
                            },
                            subscribeProgressAndWaitAll: (models, amount, from = 0) => {
                                const progresses = models.map(() => 0);
                                const messageses = models.map(() => []);
                                for (let i = 0; i < models.length; i++) {
                                    const model = models[i];
                                    if (!model.loading || subscriptions.has(model)) {
                                        progresses[i] = 1;
                                        continue;
                                    }
                                    const handleSubUpdate = ({ progress: subAmount, messages }) => {
                                        const progress = from + subAmount * amount;
                                        progresses[i] = progress;
                                        messageses[i] = messages;
                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                                        api.emitProgress(Maths_1.default.average(...progresses), [...messageses.flat(), ...lastMessage].filter(m => m), true);
                                    };
                                    model.event.subscribe("loadUpdate", handleSubUpdate);
                                    subscriptions.set(model, handleSubUpdate);
                                    model.event.subscribeOnce("loaded", () => {
                                        model.event.unsubscribe("loadUpdate", handleSubUpdate);
                                        subscriptions.delete(model);
                                    });
                                }
                                return Promise.all(models.map(model => model.await()));
                            },
                        };
                        const generated = Promise.resolve(this.model.generate?.(api));
                        void generated.catch(async (error) => {
                            console.error(`Model '${this.name}' failed to load:`, error);
                            if (this.model.useCacheOnError) {
                                const cached = await this.resolveCache(true);
                                if (cached)
                                    return resolve(cached);
                            }
                            this.event.emit("errored", { error: error });
                            this.errored = true;
                            reject(error);
                        });
                        void generated.then(async (value) => {
                            resolve(await this.set(value));
                        });
                    });
                    this.errored = false;
                    this.value = promise ?? null;
                    return undefined;
                }
                if (this.value instanceof Promise)
                    return undefined;
                return this.value ?? undefined;
            }
            async set(value) {
                const filtered = (this.model.process?.(value) ?? value);
                this._latest = this.value = (filtered ?? null);
                this.cacheTime = Date.now();
                this.version = await this.getModelVersion();
                this.loadId = loadId;
                if (this.model.cache && this.model.cache !== "Memory") {
                    const cached = { cacheTime: this.cacheTime, value, version: this.version };
                    if (this.model.cache === "Global")
                        cached.persist = true;
                    void Model.cacheDB.set("models", this.name, cached);
                }
                this.event.emit("loaded", { value: filtered });
                if (this.name)
                    console.debug(`${!this.model.cache || this.model.cache === "Memory" ? "Loaded" : "Cached"} data for '${this.name}'`);
                return filtered;
            }
            async await() {
                return this.get() ?? (await Promise.resolve(this.value)) ?? undefined;
            }
        }
        Model.Impl = Impl;
    })(Model || (Model = {}));
    exports.default = Model;
});
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
define("utility/Async", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Async;
    (function (Async) {
        async function sleep(ms, signal) {
            // let stack = new Error().stack;
            // stack = stack?.slice(stack.indexOf("\n") + 1);
            // stack = stack?.slice(stack.indexOf("\n") + 1);
            // stack = stack?.slice(0, stack.indexOf("\n"));
            // console.log("sleep", stack);
            if (!signal) {
                return new Promise(resolve => {
                    window.setTimeout(() => resolve(undefined), ms);
                });
            }
            if (signal.aborted) {
                return true;
            }
            return new Promise(resolve => {
                // eslint-disable-next-line prefer-const
                let timeoutId;
                const onAbort = () => {
                    window.clearTimeout(timeoutId);
                    resolve(true);
                };
                timeoutId = window.setTimeout(() => {
                    signal.removeEventListener("abort", onAbort);
                    resolve(false);
                }, ms);
                signal.addEventListener("abort", onAbort, { once: true });
            });
        }
        Async.sleep = sleep;
        function debounce(...args) {
            let ms;
            let callback;
            if (typeof args[0] === "function") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                [callback, ...args] = args;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return debounceByPromise(callback, ...args);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                [ms, callback, ...args] = args;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return debounceByTime(ms, callback, ...args);
            }
        }
        Async.debounce = debounce;
        const debouncedByTime = new WeakMap();
        function debounceByTime(ms, callback, ...args) {
            let info = debouncedByTime.get(callback);
            if (info && Date.now() - info.last < ms) {
                const newAbortController = new AbortController();
                info.queued = sleep(Date.now() - info.last + ms, newAbortController.signal).then(aborted => {
                    if (aborted) {
                        return info?.queued;
                    }
                    delete info.queued;
                    delete info.abortController;
                    info.last = Date.now();
                    return callback(...args);
                });
                info.abortController?.abort();
                info.abortController = newAbortController;
                return info.queued;
            }
            if (!info) {
                debouncedByTime.set(callback, info = { last: 0 });
            }
            info.last = Date.now();
            return callback(...args);
        }
        const debouncedByPromise = new WeakMap();
        function debounceByPromise(callback, ...args) {
            const debounceInfo = debouncedByPromise.get(callback);
            if (debounceInfo?.nextQueued) {
                return debounceInfo.promise;
            }
            const realCallback = () => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const result = callback(...args);
                    const promise = Promise.resolve(result);
                    debouncedByPromise.set(callback, {
                        promise,
                        nextQueued: false,
                    });
                    promise.catch(reason => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        window.dispatchEvent(new PromiseRejectionEvent("unhandledrejection", { promise, reason }));
                    });
                    return promise;
                }
                catch (error) {
                    window.dispatchEvent(new ErrorEvent("error", { error }));
                    return;
                }
            };
            if (debounceInfo) {
                debounceInfo.nextQueued = true;
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                return debounceInfo.promise.catch(realCallback).then(realCallback);
            }
            else {
                return realCallback();
            }
        }
        function schedule(...args) {
            let ms = 0;
            let callback;
            let debounceMs = false;
            let signal;
            if (typeof args[0] === "function") {
                // (cb, ...args)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                [callback, ...args] = args;
            }
            else if (typeof args[1] === "function") {
                // (ms, cb, ...args)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                [ms, callback, ...args] = args;
            }
            else if (typeof args[2] === "function") {
                // (ms, debounce | signal, cb, ...args)
                if (typeof args[1] === "object") {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    [ms, signal, callback, ...args] = args;
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    [ms, debounceMs, callback, ...args] = args;
                }
            }
            else {
                // (ms, debounce, signal, cb, ...args)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                [ms, debounceMs, signal, callback, ...args] = args;
            }
            if (debounceMs === true) {
                debounceMs = ms;
            }
            const cancelCallbacks = [];
            // eslint-disable-next-line prefer-const
            let timeoutId;
            const result = {
                cancelled: false,
                completed: false,
                cancel: () => {
                    if (result.cancelled || result.completed) {
                        return;
                    }
                    signal?.removeEventListener("abort", result.cancel);
                    result.cancelled = true;
                    window.clearTimeout(timeoutId);
                    for (const callback of cancelCallbacks) {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
                            const result = callback(...args);
                            const promise = Promise.resolve(result);
                            promise.catch(reason => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                window.dispatchEvent(new PromiseRejectionEvent("unhandledrejection", { promise, reason }));
                            });
                        }
                        catch (error) {
                            window.dispatchEvent(new ErrorEvent("error", { error }));
                        }
                    }
                    cancelCallbacks.length = 0;
                    args.length = 0;
                },
                onCancel: callback => {
                    if (result.completed) {
                        return result;
                    }
                    if (result.cancelled) {
                        try {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
                            const result = callback(...args);
                            const promise = Promise.resolve(result);
                            promise.catch(reason => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                window.dispatchEvent(new PromiseRejectionEvent("unhandledrejection", { promise, reason }));
                            });
                        }
                        catch (error) {
                            window.dispatchEvent(new ErrorEvent("error", { error }));
                        }
                    }
                    else {
                        cancelCallbacks.push(callback);
                    }
                    return result;
                },
            };
            signal?.addEventListener("abort", result.cancel, { once: true });
            timeoutId = window.setTimeout(() => {
                if (result.cancelled) {
                    return;
                }
                signal?.removeEventListener("abort", result.cancel);
                result.completed = true;
                cancelCallbacks.length = 0;
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
                    const result = debounceMs ? debounce(debounceMs, callback, ...args) : callback(...args);
                    const promise = Promise.resolve(result);
                    promise.catch(reason => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        window.dispatchEvent(new PromiseRejectionEvent("unhandledrejection", { promise, reason }));
                    });
                }
                catch (error) {
                    window.dispatchEvent(new ErrorEvent("error", { error }));
                }
            }, ms);
            return result;
        }
        Async.schedule = schedule;
        /**
         * Create an AbortSignal that will be emitted after `ms`.
         * @param ms The time until the signal will be emitted.
         * @param controller An optional existing `AbortController`.
         * @param message An optional custom timeout message.
         */
        function timeout(ms, controller = new AbortController(), message = `Timed out after ${ms} ms`) {
            schedule(ms, () => controller.abort(message));
            return controller.signal;
        }
        Async.timeout = timeout;
    })(Async || (Async = {}));
    exports.default = Async;
});
define("utility/Debug", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Debug = void 0;
    var Debug;
    (function (Debug) {
        Debug.placeholder = false;
    })(Debug || (exports.Debug = Debug = {}));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    window.Debug = Debug;
});
define("utility/Functions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Functions;
    (function (Functions) {
        function resolve(fn, ...args) {
            return typeof fn === "function" ? fn(...args) : fn;
        }
        Functions.resolve = resolve;
    })(Functions || (Functions = {}));
    exports.default = Functions;
});
define("utility/Strings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Strings;
    (function (Strings) {
        function includesAt(string, substring, index) {
            if (index < 0)
                index = string.length + index;
            if (index + substring.length > string.length)
                return false;
            for (let i = 0; i < substring.length; i++)
                if (string[i + index] !== substring[i])
                    return false;
            return true;
        }
        Strings.includesAt = includesAt;
        function sliceTo(string, substring, startAt) {
            const index = string.indexOf(substring, startAt);
            if (index === -1)
                return string;
            return string.slice(0, index);
        }
        Strings.sliceTo = sliceTo;
        function sliceAfter(string, substring, startAt) {
            const index = string.indexOf(substring, startAt);
            if (index === -1)
                return string;
            return string.slice(index + substring.length);
        }
        Strings.sliceAfter = sliceAfter;
        function trimTextMatchingFromStart(string, substring, startAt) {
            if (string.length < substring.length)
                return string;
            const index = string.indexOf(substring, startAt);
            if (index !== 0)
                return string;
            return string.slice(index + substring.length);
        }
        Strings.trimTextMatchingFromStart = trimTextMatchingFromStart;
        function trimTextMatchingFromEnd(string, substring, startAt) {
            if (string.length < substring.length)
                return string;
            const index = string.lastIndexOf(substring, startAt);
            if (index !== string.length - substring.length)
                return string;
            return string.slice(0, index);
        }
        Strings.trimTextMatchingFromEnd = trimTextMatchingFromEnd;
        function extractFromQuotes(string) {
            let substring = (string ?? "").trim();
            if (substring[0] === '"')
                substring = substring.slice(1);
            if (substring[substring.length - 1] === '"')
                substring = substring.slice(0, -1);
            return substring.trim();
        }
        Strings.extractFromQuotes = extractFromQuotes;
        function extractFromSquareBrackets(string) {
            let substring = (string ?? "");
            if (substring[0] === "[")
                substring = substring.slice(1).trimStart();
            if (substring[substring.length - 1] === "]")
                substring = substring.slice(0, -1).trimEnd();
            return substring;
        }
        Strings.extractFromSquareBrackets = extractFromSquareBrackets;
        function mergeRegularExpressions(flags, ...expressions) {
            let exprString = "";
            for (const expr of expressions)
                exprString += "|" + expr.source;
            return new RegExp(exprString.slice(1), flags);
        }
        Strings.mergeRegularExpressions = mergeRegularExpressions;
        function count(string, substring, stopAtCount = Infinity) {
            let count = 0;
            let lastIndex = -1;
            while (count < stopAtCount) {
                const index = string.indexOf(substring, lastIndex + 1);
                if (index === -1)
                    return count;
                count++;
                lastIndex = index;
            }
            return count;
        }
        Strings.count = count;
        function includesOnce(string, substring) {
            return count(string, substring, 2) === 1;
        }
        Strings.includesOnce = includesOnce;
        function getVariations(name) {
            const variations = [name];
            variations.push(name + "d", name + "ed");
            if (name.endsWith("d"))
                variations.push(...getVariations(name.slice(0, -1)));
            if (name.endsWith("ed"))
                variations.push(...getVariations(name.slice(0, -2)));
            if (name.endsWith("ing")) {
                variations.push(name.slice(0, -3));
                if (name[name.length - 4] === name[name.length - 5])
                    variations.push(name.slice(0, -4));
            }
            else {
                variations.push(name + "ing", name + name[name.length - 1] + "ing");
                if (name.endsWith("y"))
                    variations.push(name.slice(0, -1) + "ing");
            }
            if (name.endsWith("ion")) {
                variations.push(...getVariations(name.slice(0, -3)));
                if (name[name.length - 4] === name[name.length - 5])
                    variations.push(name.slice(0, -4));
            }
            else
                variations.push(name + "ion");
            if (name.endsWith("er"))
                variations.push(name.slice(0, -1), name.slice(0, -2));
            else {
                variations.push(name + "r", name + "er");
                if (name.endsWith("y"))
                    variations.push(name.slice(0, -1) + "ier");
            }
            if (name.endsWith("ier"))
                variations.push(name.slice(0, -3) + "y");
            variations.push(name + "s", name + "es");
            if (name.endsWith("s"))
                variations.push(name.slice(0, -1));
            else {
                if (name.endsWith("y"))
                    variations.push(name.slice(0, -1) + "ies");
            }
            return variations;
        }
        Strings.getVariations = getVariations;
        const REGEX_APOSTROPHE = /'/g;
        const REGEX_NON_WORD_MULTI = /\W+/g;
        function getWords(text) {
            return text.toLowerCase()
                .replace(REGEX_APOSTROPHE, "")
                .split(REGEX_NON_WORD_MULTI)
                .filter(Boolean);
        }
        Strings.getWords = getWords;
        function fuzzyMatches(a, b, options) {
            options ??= {};
            options.missingWordsThreshold ??= 0.4;
            options.maxMissingWordsForFuzzy = 4;
            const wordsA = getWords(a).map(getVariations);
            const wordsB = getWords(b).map(getVariations);
            let matches = 0;
            let misses = 0;
            let ia = 0;
            let ib = 0;
            NextMain: while (true) {
                const va = wordsA[ia];
                const vb = wordsB[ib];
                if (!va && !vb)
                    break;
                if (!va || !vb) {
                    ia++;
                    ib++;
                    misses++;
                    continue;
                }
                let loopMisses = 0;
                for (let ia2 = ia; ia2 < wordsA.length && loopMisses <= options.maxMissingWordsForFuzzy; ia2++) {
                    const va = wordsA[ia2];
                    if (va.some(va => vb.includes(va))) {
                        ia = ia2 + 1;
                        ib++;
                        matches++;
                        misses += loopMisses;
                        continue NextMain;
                    }
                    loopMisses++;
                }
                loopMisses = 0;
                for (let ib2 = ib; ib2 < wordsB.length && loopMisses <= options.maxMissingWordsForFuzzy; ib2++) {
                    const vb = wordsB[ib2];
                    if (vb.some(vb => va.includes(vb))) {
                        ia++;
                        ib = ib2 + 1;
                        matches++;
                        misses += loopMisses;
                        continue NextMain;
                    }
                    loopMisses++;
                }
                misses++;
                ia++;
                ib++;
            }
            return matches / (matches + misses) >= options.missingWordsThreshold;
        }
        Strings.fuzzyMatches = fuzzyMatches;
        const REGEX_NON_WORD_MULTI_PREV = /(?<=\W+)/g;
        function toTitleCase(text) {
            return text.split(REGEX_NON_WORD_MULTI_PREV)
                .map(word => word[0].toUpperCase() + word.slice(1))
                .join("");
        }
        Strings.toTitleCase = toTitleCase;
    })(Strings || (Strings = {}));
    exports.default = Strings;
});
define("utility/Time", ["require", "exports", "utility/Strings"], function (require, exports, Strings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Time;
    (function (Time) {
        function floor(interval) {
            return Math.floor(Date.now() / interval) * interval;
        }
        Time.floor = floor;
        function ms(ms) { return ms; }
        Time.ms = ms;
        function seconds(seconds) { return seconds * 1000; }
        Time.seconds = seconds;
        function minutes(minutes) { return minutes * 1000 * 60; }
        Time.minutes = minutes;
        function hours(hours) { return hours * 1000 * 60 * 60; }
        Time.hours = hours;
        function days(days) { return days * 1000 * 60 * 60 * 24; }
        Time.days = days;
        function weeks(weeks) { return weeks * 1000 * 60 * 60 * 24 * 7; }
        Time.weeks = weeks;
        function months(months) { return Math.floor(months * 1000 * 60 * 60 * 24 * (365.2422 / 12)); }
        Time.months = months;
        function years(years) { return Math.floor(years * 1000 * 60 * 60 * 24 * 365.2422); }
        Time.years = years;
        function decades(decades) { return Math.floor(decades * 1000 * 60 * 60 * 24 * 365.2422 * 10); }
        Time.decades = decades;
        function centuries(centuries) { return Math.floor(centuries * 1000 * 60 * 60 * 24 * 365.2422 * 10 * 10); }
        Time.centuries = centuries;
        function millenia(millenia) { return Math.floor(millenia * 1000 * 60 * 60 * 24 * 365.2422 * 10 * 10 * 10); }
        Time.millenia = millenia;
        function relative(ms, options = { style: "short" }) {
            ms -= Date.now();
            const locale = navigator.language || "en-NZ";
            if (!locale.startsWith("en"))
                return relativeIntl(ms, locale, options);
            if (Math.abs(ms) < seconds(1))
                return "now";
            const ago = ms < 0;
            if (ago)
                ms = Math.abs(ms);
            let limit = options.components ?? Infinity;
            let value = ms;
            let result = ms > 0 && options.label !== false ? "in " : "";
            value = Math.floor(ms / years(1));
            ms -= value * years(1);
            if (value && limit-- > 0)
                result += `${value} year${value === 1 ? "" : "s"}${limit > 0 ? ", " : ""}`;
            value = Math.floor(ms / months(1));
            ms -= value * months(1);
            if (value && limit-- > 0)
                result += `${value} month${value === 1 ? "" : "s"}${limit > 0 ? ", " : ""}`;
            value = Math.floor(ms / weeks(1));
            ms -= value * weeks(1);
            if (value && limit-- > 0)
                result += `${value} week${value === 1 ? "" : "s"}${limit > 0 ? ", " : ""}`;
            value = Math.floor(ms / days(1));
            ms -= value * days(1);
            if (value && limit-- > 0)
                result += `${value} day${value === 1 ? "" : "s"}${limit > 0 ? ", " : ""}`;
            value = Math.floor(ms / hours(1));
            ms -= value * hours(1);
            if (value && limit-- > 0)
                result += `${value} hour${value === 1 ? "" : "s"}${limit > 0 ? ", " : ""}`;
            value = Math.floor(ms / minutes(1));
            ms -= value * minutes(1);
            if (value && limit-- > 0)
                result += `${value} minute${value === 1 ? "" : "s"}${limit > 0 ? ", " : ""}`;
            value = Math.floor(ms / seconds(1));
            if (value && limit-- > 0)
                result += `${value} second${value === 1 ? "" : "s"}`;
            result = Strings_1.default.trimTextMatchingFromEnd(result, ", ");
            return `${result}${ago && options.label !== false ? " ago" : ""}`;
        }
        Time.relative = relative;
        function relativeIntl(ms, locale, options) {
            const rtf = new Intl.RelativeTimeFormat(locale, options);
            let value = ms;
            value = Math.floor(ms / years(1));
            if (value)
                return rtf.format(value, "year");
            value = Math.floor(ms / months(1));
            if (value)
                return rtf.format(value, "month");
            value = Math.floor(ms / weeks(1));
            if (value)
                return rtf.format(value, "week");
            value = Math.floor(ms / days(1));
            if (value)
                return rtf.format(value, "day");
            value = Math.floor(ms / hours(1));
            if (value)
                return rtf.format(value, "hour");
            value = Math.floor(ms / minutes(1));
            if (value)
                return rtf.format(value, "minute");
            value = Math.floor(ms / seconds(1));
            return rtf.format(value, "second");
        }
        function absolute(ms, options = { dateStyle: "full", timeStyle: "medium" }) {
            const locale = navigator.language || "en-NZ";
            const rtf = new Intl.DateTimeFormat(locale, options);
            return rtf.format(ms);
        }
        Time.absolute = absolute;
    })(Time || (Time = {}));
    Object.assign(window, { Time });
    exports.default = Time;
});
define("utility/Tuples", ["require", "exports", "utility/Arrays"], function (require, exports, Arrays_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tuples;
    (function (Tuples) {
        function make(...values) {
            return values;
        }
        Tuples.make = make;
        const nullishFilters = Object.fromEntries(Arrays_4.default.range(6)
            .map(index => make(index, (value) => value[index] !== undefined && value[index] !== null)));
        function filterNullish(index) {
            return nullishFilters[index];
        }
        Tuples.filterNullish = filterNullish;
        const falsyFilters = Object.fromEntries(Arrays_4.default.range(6)
            .map(index => make(index, (value) => value[index])));
        function filterFalsy(index) {
            return falsyFilters[index];
        }
        Tuples.filterFalsy = filterFalsy;
        function getter(index) {
            return tuple => tuple[index];
        }
        Tuples.getter = getter;
        function filter(index, predicate) {
            return (tuple, i) => predicate(tuple[index], i);
        }
        Tuples.filter = filter;
    })(Tuples || (Tuples = {}));
    exports.default = Tuples;
});
define("utility/URL", ["require", "exports", "utility/EventManager"], function (require, exports, EventManager_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let params;
    let query;
    function updateURL() {
        let queryString = query.toString();
        if (queryString)
            queryString = `?${queryString}`;
        history.replaceState(null, "", `${location.origin}${location.pathname}${queryString}${location.hash}`);
    }
    let poppingState = false;
    EventManager_5.EventManager.global.subscribe("popstate", () => {
        poppingState = true;
        URL.event.emit("navigate");
        poppingState = false;
    });
    class URL {
        static get hash() {
            return location.hash.slice(1);
        }
        static set hash(value) {
            if (!poppingState)
                history.pushState(null, "", `${location.origin}${location.pathname}${location.search}${value ? `#${value}` : ""}`);
        }
        static get path() {
            const path = location.pathname.slice(location.pathname.startsWith("/beta/") ? 6 : 1);
            return !path || path === "/" ? null : path;
        }
        static set path(value) {
            if (value && location.pathname.startsWith("/beta/"))
                value = `/beta/${value}`;
            if (value && !value?.startsWith("/"))
                value = `/${value}`;
            if (!poppingState)
                history.pushState(null, "", `${location.origin}${value ?? "/"}${location.search}`);
        }
        static get params() {
            return params ??= new Proxy(query ??= new URLSearchParams(location.search), {
                has(params, key) {
                    return params.has(key);
                },
                get(params, key) {
                    return params.get(key);
                },
                set(params, key, value) {
                    params.set(key, value);
                    updateURL();
                    return true;
                },
                deleteProperty(params, key) {
                    params.delete(key);
                    updateURL();
                    return true;
                },
            });
        }
    }
    URL.event = EventManager_5.EventManager.make();
    exports.default = URL;
});
define("utility/decorator/Bound", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Final = exports.Bound = void 0;
    function Bound(target, key, descriptor) {
        return Bounder(target, key, descriptor);
    }
    exports.Bound = Bound;
    function Final(target, key, descriptor) {
        return Bounder(target, key, descriptor);
    }
    exports.Final = Final;
    function Bounder(target, key, descriptor) {
        return {
            configurable: false,
            enumerable: descriptor.enumerable,
            get() {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
                if (!this || this === target.prototype || this.hasOwnProperty(key) || typeof descriptor.value !== "function") {
                    return descriptor.value;
                }
                const value = descriptor.value.bind(this);
                Object.defineProperty(this, key, {
                    configurable: false,
                    enumerable: descriptor.enumerable,
                    value,
                });
                return value;
            },
        };
    }
    exports.default = Bound;
});
define("utility/endpoint/Endpoint", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Endpoint {
        constructor(path, builder) {
            this.path = path;
            this.builder = builder;
        }
        async query(...args) {
            const path = this.resolvePath(...args);
            let headers;
            return this.fetch(path, ...args)
                .then(response => {
                headers = response.headers;
                return response.text();
            })
                .then(text => {
                if (path.endsWith(".json")) {
                    // text = text
                    // 	.replace(/\s*\/\/[^\n"]*(?=\n)/g, "")
                    // 	.replace(/(?<=\n)\s*\/\/[^\n]*(?=\n)/g, "")
                    // 	.replace(/,(?=[^}\]"\d\w_-]*?[}\]])/gs, "");
                    let parsed;
                    try {
                        parsed = JSON.parse(text);
                    }
                    catch (err) {
                        console.warn(text);
                        throw err;
                    }
                    const result = this.process(parsed);
                    Object.defineProperty(result, "_headers", {
                        enumerable: false,
                        get: () => headers,
                    });
                    return result;
                }
                throw new Error("Unknown file type");
            });
        }
        process(received) {
            return received;
        }
        async fetch(path, ...args) {
            path ??= this.resolvePath(...args);
            const request = {
                ...this.getDefaultRequest(...args),
                ...await this.builder?.(...args) ?? {},
            };
            let body;
            if (typeof request.body === "object") {
                if (request.headers?.["Content-Type"] === "application/x-www-form-urlencoded")
                    body = new URLSearchParams(Object.entries(request.body)).toString();
                else if (request.headers?.["Content-Type"] === undefined || request.headers?.["Content-Type"] === "application/json") {
                    request.headers ??= {};
                    request.headers["Content-Type"] = "application/json";
                    body = JSON.stringify(request.body);
                }
            }
            let search = "";
            if (request.search) {
                search = "?";
                if (typeof request.search === "object")
                    search += new URLSearchParams(Object.entries(request.search)).toString();
                else
                    search += request.search;
            }
            return fetch(`${path}${search}`, {
                ...request,
                body,
                headers: Object.fromEntries(Object.entries(await this.getHeaders(request?.headers)).filter(([key, value]) => typeof value === "string")),
            });
        }
        resolvePath(...args) {
            return typeof this.path === "string" ? this.path : this.path(...args);
        }
        getDefaultRequest(...args) {
            return {};
        }
        // eslint-disable-next-line @typescript-eslint/require-await
        async getHeaders(headers) {
            return { ...headers };
        }
    }
    exports.default = Endpoint;
});
define("utility/maths/Vector2", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IVector2 = void 0;
    var IVector2;
    (function (IVector2) {
        function ZERO() {
            return { x: 0, y: 0 };
        }
        IVector2.ZERO = ZERO;
        function distance(v1, v2) {
            return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
        }
        IVector2.distance = distance;
        function distanceWithin(v1, v2, within) {
            return (v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2 < within ** 2;
        }
        IVector2.distanceWithin = distanceWithin;
    })(IVector2 || (exports.IVector2 = IVector2 = {}));
});
