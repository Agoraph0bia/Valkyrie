import { Monitor } from './valkyrie';

export type IAction = {
	id?: string;
	name: string;
	monitor: Monitor;
	type: string;
	conditions: any[];
	options: any;
	function?: Promise<any>;
};

export class ActionBase implements IAction {
	public id?: string;
	public name!: string;
	public monitor!: Monitor;
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
		this.function = this.waitAction(this.options.waitMS);
	}

	waitAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}

export interface SMTPAction extends ActionBase {}

export interface RESTAction extends ActionBase {}

export interface QueryAction extends ActionBase {}

export interface ScriptAction extends ActionBase {}

export interface DataTransformAction extends ActionBase {}
