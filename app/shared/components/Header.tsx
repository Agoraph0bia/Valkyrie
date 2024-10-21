import SearchBar from './SearchBar';

const Header = (params: any) => {
	return (
		<nav className='flex mt-4 mx-4 rounded-xl text-black bg-[#181818]'>
			<div className='flex h-14 w-7/12 items-center ml-5 overflow-hidden text-white'>
				<h5 className='font-sans text-xl mr-16 antialiased font-semibold select-none tracking-normal text-white'>
					valkyrie
				</h5>
				<SearchBar />
			</div>
		</nav>
	);
};
export default Header;
