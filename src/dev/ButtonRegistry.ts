/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Env from "utility/Env";
import Session from "utility/Session";

export interface IButtonImplementation<ARGS extends any[]> {
	name: string;
	execute (...args: ARGS): any;
}

export const BUTTON_REGISTRY = {
	createAuthor: {
		name: "Create Author",
		async execute (name: string, vanity: string) {
			await fetch(`${Env.API_ORIGIN}author/create`, {
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
			await Session.refresh();
		},
	},

	updateAuthor: {
		name: "Update Author",
		async execute (name?: string, description?: string, vanity?: string, support_link?: string, support_message?: string) {
			await fetch(`${Env.API_ORIGIN}author/update`, {
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
		async execute (label: string, vanity: string) {
			const response = await fetch(`${Env.API_ORIGIN}author/${vanity}/get`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(label, response);
		},
	},

	clearSession: {
		name: "Clear Session",
		async execute () {
			await fetch(`${Env.API_ORIGIN}session/reset`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			});

			await Session.refresh();
		},
	},

	createWork: {
		name: "Create Work",
		async execute (name: string, description: string, vanity: string, status?: string, visibility?: string) {
			await fetch(`${Env.API_ORIGIN}work/create`, {
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
		async execute (url: string, name?: string, description?: string, vanity?: string, status?: string, visibility?: string) {
			await fetch(`${Env.API_ORIGIN}work/${url}/update`, {
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
		async execute (url: string) {
			await fetch(`${Env.API_ORIGIN}work/${url}/delete`, {
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
		async execute (label: string, url: string) {
			const response = await fetch(`${Env.API_ORIGIN}work/${url}/get`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(label, response);
		},
	},

	createChapter: {
		name: "Create Chapter",
		async execute (name: string, body: string, work_url: string, visibility?: string) {
			await fetch(`${Env.API_ORIGIN}work/${work_url}/chapter/create`, {
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
		async execute (workVanity: string, index: number, name?: string, body?: string, visibility?: string) {
			await fetch(`${Env.API_ORIGIN}work/${workVanity}/chapter/${index}/update`, {
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
		async execute (work_url: string, index: number) {
			await fetch(`${Env.API_ORIGIN}work/${work_url}/chapter/${index}/delete`, {
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
		async execute (label: string, work_url: string, index: string) {
			const response = await fetch(`${Env.API_ORIGIN}work/${work_url}/chapter/${index}/get`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(label, response);
		},
	},

	follow: {
		name: "Follow",
		async execute (type: string, vanity: string) {
			await fetch(`${Env.API_ORIGIN}follow/${type}/${vanity}`, {
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
		async execute (type: string, vanity: string) {
			await fetch(`${Env.API_ORIGIN}unfollow/${type}/${vanity}`, {
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
		async execute (type: string, vanity: string) {
			const response = await fetch(`${Env.API_ORIGIN}follows/${type}/${vanity}`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(response);
		},
	},

	getAllFollows: {
		name: "Get All Follows",
		async execute (type: string, page: number = 0) {
			const response = await fetch(`${Env.API_ORIGIN}following/${type}?page=${page}`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(response);
		},
	},

	getAllFollowsMerged: {
		name: "Get All Follows Merged",
		async execute (page: number = 0) {
			const response = await fetch(`${Env.API_ORIGIN}following?page=${page}`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(response);
		},
	},

	ignore: {
		name: "Ignore",
		async execute (type: string, vanity: string) {
			await fetch(`${Env.API_ORIGIN}ignore/${type}/${vanity}`, {
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
		async execute (type: string, vanity: string) {
			await fetch(`${Env.API_ORIGIN}unignore/${type}/${vanity}`, {
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
		async execute (type: string, vanity: string) {
			const response = await fetch(`${Env.API_ORIGIN}ignores/${type}/${vanity}`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(response);
		},
	},

	getAllIgnores: {
		name: "Get All Ignores",
		async execute (type: string, page: number = 0) {
			const response = await fetch(`${Env.API_ORIGIN}ignoring/${type}?page=${page}`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(response);
		},
	},

	getAllIgnoresMerged: {
		name: "Get All Ignores Merged",
		async execute (page: number = 0) {
			const response = await fetch(`${Env.API_ORIGIN}ignoring?page=${page}`, {
				credentials: "include",
			}).then(response => response.json());
			console.log(response);
		},
	},

} satisfies Record<string, IButtonImplementation<any[]>>;
