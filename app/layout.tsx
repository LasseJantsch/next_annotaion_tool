import type { Metadata } from "next";
import "./globals.css";
import Header from "./header";


export const metadata: Metadata = {
  title: "Create Next App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overview_site_container">
        <Header title="OVERVIEW" show_menu={true} />
        {children}
      </body>
    </html>
  );
}
