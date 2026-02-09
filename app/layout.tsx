'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isToolPage = pathname.includes('/architecture-builder') || 
                     pathname.includes('/code-reviewer') || 
                     pathname.includes('/docs-generator');

  if (!isToolPage) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          <ChatPanel />
        </div>
      </body>
    </html>
  );
}
