const SearchBar = () => {
  return (
    <div className="flex w-full">
      <div className="flex w-full h-11 rounded-lg bg-stone-700 overflow-hidden">
        <div className="grid place-items-center h-full w-20 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          className="h-full w-full select-none outline-none bg-stone-700 text-white "
          type="text"
          id="search"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default SearchBar;
