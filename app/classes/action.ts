import { Flow } from './flow';

export type IAction = {
	id?: string;
	name: string;
	Flow: Flow;
	type: string;
	conditions: any[];
	options: any;
	function: Promise<any>;
	results: any[];
};

export type ActionBaseOptions = {
	timeout?: number;
};

export type WaitActionOptions = {
	waitTIme: number;
};

export class ActionBase implements IAction {
	public id?: string;
	public name!: string;
	public Flow!: Flow;
	public type!: string;
	public conditions: any[] = [];
	public options!: ActionBaseOptions;
	public function!: Promise<any>;
	public results: any[] = [];

	constructor(args: IAction) {
		Object.assign(this, args);
	}
}

export class WaitAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.WaitAction(this.options, this.results);
	}

	WaitAction = async (options: any, results: any[]): Promise<any[]> =>
		new Promise((resolve) => {
			setTimeout(() => resolve(results), options.timeout);
		});
}

export class SMTPAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.SMTPAction(this.options, this.results);
	}

	SMTPAction = async (options: any, result: any): Promise<boolean> =>
		new Promise((res) => {
			res(result);
		});
}

export class RESTAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.RESTAction(this.options, this.results);
	}

	RESTAction = async (options: any, result: any): Promise<boolean> =>
		new Promise((res) => {
			res(result);
		});
}

export class QueryAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.QueryAction(this.options, this.results);
	}

	QueryAction = async (options: any, result: any): Promise<boolean> =>
		new Promise((res) => {
			res(result);
		});
}

export class ScriptAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.ScriptAction(this.options, this.results);
	}

	ScriptAction = async (options: any, result: any): Promise<boolean> =>
		new Promise((res) => {
			res(result);
		});
}

export class DataTransformAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.DataTransformAction(this.options, this.results);
	}

	DataTransformAction = async (options: any, result: any): Promise<boolean> =>
		new Promise((res) => {
			res(result);
		});
}
