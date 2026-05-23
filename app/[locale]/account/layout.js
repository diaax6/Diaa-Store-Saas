import StoreHeader from '../components/StoreHeader';
import StoreFooter from '../components/StoreFooter';
import AccountSidebar from './AccountSidebar';

export default async function AccountLayout({ children, params }) {
  const { locale } = await params;
  return (
    <>
      <StoreHeader locale={locale} />
      <main className="container" style={{ padding: '32px 24px', minHeight: 'calc(100vh - 140px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
          <AccountSidebar locale={locale} />
          <div>{children}</div>
        </div>
      </main>
      <StoreFooter locale={locale} />
    </>
  );
}
