import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

const Breadcrumbs = () => {
	const paths = usePathname();

	// const breadcrumbs = React.useMemo(() => {
	//   const pathNames = paths.split('/').filter((p) => p.length > 0);

	// });

	return (
		<div className='flex pt-5 justify-start w-full'>
			{/* <ul>
				{breadcrumbs.map((crumb, idx) => {
					<Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />;
				})}
			</ul> */}
		</div>

		// <div className='flex pt-5 justify-start w-full'>
		// 	<ul>
		// 		<li>
		// 			<Link href={process.env.NEXT_PUBLIC_BASEPATH as string}></Link>
		// 		</li>
		// 		{pathNames.length > 0}
		// 		{pathNames.map((link, index) => {
		// 			let href = `${pathNames.slice(0, index + 1).join('/')}`;
		// 			return (
		// 				<React.Fragment key={index}>
		// 					<li>
		// 						<Link href={process.env.NEXT_PUBLIC_BASEPATH + href}>
		// 							{href.slice(1, link.length).replaceAll('/', ' > ')}
		// 						</Link>
		// 					</li>
		// 					{pathNames.length !== index + 1}
		// 				</React.Fragment>
		// 			);
		// 		})}
		// 	</ul>
		// </div>
	);
};

// const Crumb = (text: defaultText, href: string, last = false) => {
// 	const [text, setText] = React.useState(defaultText);

//   if (last) {
// 		return text;
// 	}

// 	return (
// 		<li>
// 			<Link className='no-underline hover:underline' href={href}>
// 				{text}
// 			</Link>
// 		</li>
// 	);
// };

export default Breadcrumbs;
