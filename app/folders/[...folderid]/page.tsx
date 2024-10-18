import ContentsTable from '../../components/FolderContentsTable';
import Breadcrumbs from '../../components/Breadcrumbs';

import { dbOpen } from '@/app/lib/db';

export default async function Page({ params }: { params: { slug: number } }) {
  const db = await dbOpen();

  const result = db
    .prepare(
      `SELECT ROWNUM() AS Key,
        f.folderid AS ID,
				f.[Name],
				NULL AS Status,
				NULL AS LastRunTime,
				NULL AS NextRunTime,
				f.IsActive
			FROM folders f
			WHERE f.parentid = ${params.slug}
				
			UNION

			SELECT ROWNUM(),
        m.monitorid,
				m.[Name],
				t.[Name],
				m.LastRunTime,
				m.NextRunTime,
				m.isactive
			FROM monitors m
			JOIN statustypes t
				ON m.statusid = t.statusid
			WHERE m.folderid = ${params.slug}`
    )
    .all();
  db.close();

  return (
    <div className="flex flex-col items-center">
      <Breadcrumbs />
      <ContentsTable items={result} />
    </div>
  );
}
