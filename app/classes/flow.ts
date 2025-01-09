import { IAction } from './action';

export type FlowOptions = {
	pattern: string;
	startDate?: Date;
	endDate?: Date;
	retries: number;
	retryDelay?: number;
};

export type IFlow = {
	id: string;
	name: string;
	options: FlowOptions;
};

export class Flow implements IFlow {
	public id!: string;
	public name!: string;
	public actions?: IAction;
	public options!: FlowOptions;

	constructor(args: IFlow) {
		Object.assign(this, args);
	}

	waitAction = async (ms: number): Promise<boolean> =>
		new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, ms);
		});
}
