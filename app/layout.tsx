import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Annotation Tool',
  description: 'Simple Tool for Text Annotation',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
