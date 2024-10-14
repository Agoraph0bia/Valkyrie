'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const minWidth = 150,
    maxWidth = 350;

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: any) => {
      if (isResizing) {
        if (!sidebarRef.current) return;

        const newWidth =
          mouseMoveEvent.clientX -
          sidebarRef.current.getBoundingClientRect().left;

        if (newWidth > minWidth && newWidth < maxWidth)
          setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex h-full select-none">
      <div
        ref={sidebarRef}
        className="flex h-full px-5 py-8 rounded-xl text-white border border-neutral-800 bg-[#181818]"
        style={{ width: sidebarWidth }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ul>
          <li className="block">
            <Link href={`/folders/`}>Home</Link>
          </li>
          <li className="block">
            <Link href={``}>Data Sources</Link>
          </li>
          <li className="block">
            <Link href={``}>Dashboards</Link>
          </li>
          <li className="block">
            <Link href={``}>Logs</Link>
          </li>
          <li className="block">
            <Link href={``}>Settings</Link>
          </li>
        </ul>
      </div>
      <div
        className="h-full w-1 cursor-col-resize"
        onMouseDown={startResizing}
      />
    </div>
  );
}
