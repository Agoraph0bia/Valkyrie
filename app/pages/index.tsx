import SearchBar from '../components/SearchBar';
import ContentsTable from '../components/FolderContentsTable';
import Image from 'next/image';
import listViewIcon from './assets/listview.svg';
import gridViewIcon from './assets/gridview.svg';

export const getServerSideProps: any = async (context: any) => {
	try {
		const folderid = context.params.folderid;

		const res = await fetch(
			`${process.env.API_SERVER}:${process.env.API_PORT}/folders/root/`
		);

		if (!res.ok) throw 'No contents found';

		const items = await res.json();
		return { props: { items } };
	} catch (ex) {
		return { props: {} };
	}
};

export default function Page({ items }: any) {
	return (
		<div className='flex flex-col items-center'>
			<header className='select-none text-4xl my-6'>Home</header>
			<SearchBar />
			<div className='flex flex-row items-center  select-none border-2 rounded-full border-solid border-white mt-5'>
				<button className='transition ease-in-out w-10 p-2 border-r-2 focus:bg-blue-900 border-r-white rounded-l-full'>
					<Image priority src={listViewIcon} alt='x' />
				</button>
				<button className='transition ease-in-out w-10 p-3 focus:bg-blue-900 rounded-r-full'>
					<Image priority src={gridViewIcon} alt='x' />
				</button>
			</div>

			<ContentsTable items={items} />
		</div>
	);
}
