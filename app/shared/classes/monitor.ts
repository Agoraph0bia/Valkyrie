import ioredis from 'ioredis';

export class monitor {
	public id: number;
	public name: String;
	public folderid: number;

	public constructor(id: number, name: string, folderid: number) {
		this.id = id;
		this.name = name;
		this.folderid = folderid;
	}
}
