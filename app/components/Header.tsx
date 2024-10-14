import SearchBar from './SearchBar';

const Header = (params: any) => {
  return (
    <nav className="flex h-16 mt-4 mx-4 rounded-xl text-black bg-[#181818]">
      <div className="flex w-3/5 items-center ml-5 overflow-hidden text-white">
        <h5 className="font-sans text-xl mr-10 antialiased font-semibold select-none tracking-normal text-white">
          valkyrie
        </h5>
        <SearchBar />
      </div>
    </nav>
  );
};
export default Header;
