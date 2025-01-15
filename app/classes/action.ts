import { Flow } from './flow';
import { ConditionBase } from './condition';

interface IAction<ActionResult> {
	id?: string;
	name: string;
	flow: Flow;
	conditions: ConditionBase[];
	options: ActionBaseOptions;
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
	public conditions: ConditionBase[] = [];
	public options: ActionBaseOptions = {};

	constructor(args: IAction<ActionResult>) {
		Object.assign(this, args);
	}
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
