import Header from '../(components)/header';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <div className="overview_site_container">
        <Header/>
        {children}
    </div>
  );
}

