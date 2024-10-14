// These styles apply to every route in the application
import './app.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col w-screen h-screen bg-slate-600">
      <Header></Header>
      <div className="flex flex-row h-full p-3">
        <Sidebar></Sidebar>
        <div className="flex justify-center px-5 rounded-xl bg-neutral-900">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}
