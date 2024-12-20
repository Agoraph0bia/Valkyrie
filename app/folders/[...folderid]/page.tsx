import ContentsTable from '../FolderContentsTable';
import Breadcrumbs from '../../components/Breadcrumbs';

export default async function Page({ params }: { params: { slug: number } }) {
	return (
		<div className='flex flex-col items-center'>
			<Breadcrumbs />
			<ContentsTable />
		</div>
	);
}
