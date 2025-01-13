import { Flow } from './flow';
import { ConditionBase } from './condition';

interface IAction<ActionResult> {
	id?: string;
	name: string;
	flow: Flow;
	type: string;
	conditions: ConditionBase[];
	options: ActionBaseOptions;
	action(prevResults: ActionResult[]): Promise<ActionResult>;
}

export type ActionBaseOptions = {
	timeout?: number;
	cancelOnError?: boolean;
};

export type WaitActionOptions = {
	waitTime: number;
} & ActionBaseOptions;

export type ActionResult = {
	action: ActionBase;
	data: any;
	success: boolean;
	error?: string | unknown;
};

export abstract class ActionBase implements IAction<ActionResult> {
	public id?: string;
	public name!: string;
	public flow!: Flow;
	public type!: string;
	public conditions: ConditionBase[] = [];
	public options: ActionBaseOptions = {};
	public abstract action(prevResults: ActionResult[]): Promise<ActionResult>;

	constructor(args: IAction<ActionResult>) {
		Object.assign(this, args);
	}

	// protected withTimeout(
	// 	promise: Promise<ActionResult>,
	// 	timeout: number
	// ): Promise<ActionResult> {
	// 	return new Promise((resolve, reject) => {
	// 		const timer = setTimeout(
	// 			() => reject({ success: false, error: 'Timeout' }),
	// 			timeout
	// 		);
	// 		promise
	// 			.then((result) => {
	// 				clearTimeout(timer);
	// 				resolve(result);
	// 			})
	// 			.catch((error) => {
	// 				clearTimeout(timer);
	// 				reject(error);
	// 			});
	// 	});
	// }
}

export class WaitAction extends ActionBase {
	constructor(args: IAction<ActionResult>) {
		super(args);
	}

	action(prevResults: ActionResult[]): Promise<ActionResult> {
		let test = prevResults;
		return new Promise<ActionResult>((resolve) => {
			setTimeout(() =>
				resolve({ action: this, data: {}, success: true } as ActionResult)
			);
		});
	}
}

export class SMTPAction extends ActionBase {
	constructor(args: IAction<ActionResult>) {
		super(args);
	}

	action(prevResults: ActionResult[]): Promise<ActionResult> {
		let test = prevResults;
		return new Promise((resolve) => {
			setTimeout(() =>
				resolve({ action: this, data: {}, success: true } as ActionResult)
			);
		});
	}
}

export class RESTAction extends ActionBase {
	constructor(args: IAction<ActionResult>) {
		super(args);
	}

	action(prevResults: ActionResult[]): Promise<ActionResult> {
		let test = prevResults;
		return new Promise((resolve) => {
			setTimeout(() =>
				resolve({ action: this, data: {}, success: true } as ActionResult)
			);
		});
	}
}

export class QueryAction extends ActionBase {
	constructor(args: IAction<ActionResult>) {
		super(args);
	}

	action(prevResults: ActionResult[]): Promise<ActionResult> {
		let test = prevResults;
		return new Promise((resolve) => {
			setTimeout(() =>
				resolve({ action: this, data: {}, success: true } as ActionResult)
			);
		});
	}
}

export class ScriptAction extends ActionBase {
	constructor(args: IAction<ActionResult>) {
		super(args);
	}

	action(prevResults: ActionResult[]): Promise<ActionResult> {
		let test = prevResults;
		return new Promise((resolve) => {
			setTimeout(() =>
				resolve({ action: this, data: {}, success: true } as ActionResult)
			);
		});
	}
}

export class DataTransformAction extends ActionBase {
	constructor(args: IAction<ActionResult>) {
		super(args);
	}

	action(prevResults: ActionResult[]): Promise<ActionResult> {
		let test = prevResults;
		return new Promise((resolve) => {
			setTimeout(() =>
				resolve({ action: this, data: {}, success: true } as ActionResult)
			);
		});
	}
}
