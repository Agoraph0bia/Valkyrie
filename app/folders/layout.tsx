import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Component } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'valkyrie',
  description: 'Application monitoring',
};

// export const getServerSideProps: any = async (context: any) => {
//   try {
//     const folderid = context.params.folderid;

//     const res = await fetch(
//       `${process.env.API_SERVER}:${process.env.API_PORT}/folders/root/`
//     );

//     if (!res.ok) throw 'No contents found';

//     const items = await res.json();
//     return { props: { items } };
//   } catch (ex) {
//     return { props: {} };
//   }
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col w-screen h-screen bg-[#383838]">
          <Header></Header>
          <div className="flex flex-row h-full px-4 pb-4 pt-1 rounded-xl">
            <Sidebar></Sidebar>
            <div className="flex w-full justify-center px-5 rounded-xl bg-[#1f1f1f]">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
