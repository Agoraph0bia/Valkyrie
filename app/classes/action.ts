import { Flow } from './flow';

export type IAction = {
	id?: string;
	name: string;
	Flow: Flow;
	type: string;
	conditions: any[];
	options: any;
	function?: Promise<any>;
};

export class ActionBase implements IAction {
	public id?: string;
	public name!: string;
	public Flow!: Flow;
	public type!: string;
	public conditions!: any[];
	public options: any;
	public function?: Promise<any>;

	constructor(args: IAction) {
		Object.assign(this, args);
	}
}

export class WaitAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.WaitAction(this.options.waitMS);
	}

	WaitAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}

export class SMTPAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.SMTPAction(this.options.waitMS);
	}

	SMTPAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}

export class RESTAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.RESTAction(this.options.waitMS);
	}

	RESTAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}

export class QueryAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.QueryAction(this.options.waitMS);
	}

	QueryAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}

export class ScriptAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.ScriptAction(this.options.waitMS);
	}

	ScriptAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}

export class DataTransformAction extends ActionBase {
	constructor(args: IAction) {
		super(args);
		this.function = this.DataTransformAction(this.options.waitMS);
	}

	DataTransformAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}
