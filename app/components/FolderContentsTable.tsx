import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
  RowModel,
  Table,
  TableState,
  Updater,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const ContentsTable = async (params: any) => {
  type Item = {
    ID: number;
    Name: string;
    Status: number;
    LastRunTime: number;
    NextRunTime: number;
    IsActive: number;
  };

  const columnHelper = createColumnHelper<Item>();

  const fallback = [];
  const columns = useMemo(
    () => [
      columnHelper.accessor('ID', {
        header: 'ID',
      }),
      columnHelper.accessor('ID', {
        header: 'Name',
      }),
      columnHelper.accessor('ID', {
        header: 'Status',
      }),
      columnHelper.accessor('ID', {
        header: 'LastRunTime',
      }),
      columnHelper.accessor('ID', {
        header: 'NextRunTime',
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: [],
    getCoreRowModel: getCoreRowModel(),
  });

  const detailRow = (
    <tr>
      <td colSpan={6} className="h-12 bg-white"></td>
    </tr>
  );

  return (
    //   <tr
    //     key={}
    //     onClick={() => {}}
    //     // onDoubleClick={() =>
    //     //   i.folderid ? router.push(`/folders/${i.folderid}`) : null
    //     // }
    //     className="cursor-default whitespace-nowrap border-b border-b-neutral-600 text-gray-300 hover:bg-zinc-800 focus:bg-blue-900"
    //   >
    //     <td className="p-3">
    //       <div className="flex flex-col">
    //         {/* {i.folderid ? (
    //                         <Image src={folderimg} alt="Logo" />
    //                     ) : null} */}
    //         <p className="inline-block text-sm font-bold">{i.name}</p>
    //       </div>
    //     </td>
    //     <td className="text-center">
    //       {i.data?.Status ? (
    //         <p className="inline-block text-sm">{i.data?.Output ?? ''}</p>
    //       ) : null}
    //     </td>
    //     <td className="text-center">
    //       {i.data?.Status ? (
    //         <p className="inline-block text-sm px-3 py-0.5 rounded-full text-white font-bold ${} bg-sky-600">
    //           {i.data?.Status ?? ''}
    //         </p>
    //       ) : null}
    //     </td>
    //     <td className="text-center">
    //       {i.data?.Status ? (
    //         <p className="inline-block text-sm">{i.data?.LastRunTime ?? ''}</p>
    //       ) : null}
    //     </td>
    //     <td className="text-center">
    //       {i.data?.Status ? (
    //         <p className="inline-block text-sm">{i.data?.Nextruntime ?? ''}</p>
    //       ) : null}
    //     </td>
    //     <td className="text-center">
    //       <p className="inline-block text-sm">Gear</p>
    //     </td>
    //   </tr>
    table
  );
};

//   const table = (
//     <table id="contentsTable" className="w-full mt-8 table-fixed">
//       <thead className="select-none cursor-pointer whitespace-nowrap border-b border-b-neutral-600 font-bold leading-none antialiased text-sm font-sans text-gray-300">
//         <tr>
//           <th className="text-left p-3 whitespace-nowrap">
//             <p className="block">Name</p>
//           </th>
//           <th>
//             <p className="block text-center">Output</p>
//           </th>
//           <th>
//             <p className="">Status</p>
//           </th>
//           <th>
//             <p className="block text-center">Last Run Time</p>
//           </th>
//           <th>
//             <p className="block text-center">Next Run Time</p>
//           </th>
//           <th>
//             <p className="block text-center">Action</p>
//           </th>
//         </tr>
//       </thead>
//       <tbody>{itemsElements}</tbody>
//     </table>
//   );
//   return table;
// };

export default ContentsTable;
