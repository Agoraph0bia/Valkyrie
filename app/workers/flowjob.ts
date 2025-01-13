import { SandboxedJob } from 'bullmq';
import { ActionBase, ActionResult } from '../classes/action';

export const flowJob = async (job: SandboxedJob) => {
	let jobData = job.data;

	if (!jobData) throw new Error('Job data corrupted!');

	let jobTimeout = new Promise<void>((_r, rej) =>
		setTimeout(() => rej(new Error('Flow timeout exceeded')), jobData.timeout)
	);

	let previousResults: ActionResult[] = [];
	let results: ActionResult[] = [];

	let actionChain = (jobData?.actions as ActionBase[]).reduce(
		async (prevPromise, currentAction) => {
			await prevPromise; //Outside of try block so that errors are handled in prev loop directly.

			try {
				let actionTimeout = new Promise((_r, rej) =>
					setTimeout(
						() => rej(new Error('Action timeout exceeded')),
						currentAction?.options?.timeout ?? 2 * 60 * 60 * 1000
					)
				);

				const result = await Promise.race([
					actionTimeout,
					currentAction.action(previousResults),
				]);

				if (result instanceof Error) {
					let actionResult = {
						action: currentAction,
						data: {},
						success: false,
						error: result.message,
					} as ActionResult;

					results.push(actionResult);

					if (currentAction.options.cancelOnError)
						throw new Error('Execution stopped due to rejection');
				} else {
					let actionResult = result as ActionResult;
					results.push(actionResult);
					previousResults.push(actionResult);
				}
			} catch (error) {
				let result = {
					action: currentAction,
					data: {},
					success: false,
					error: error instanceof Error ? error.message : error,
				} as ActionResult;

				results.push(result);
				previousResults.push(result);
			}
		},
		Promise.resolve()
	);

	await Promise.race([jobTimeout, actionChain]);

	return results;
};
