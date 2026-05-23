import AnnouncementBar from '../components/AnnouncementBar';
import StoreHeader from '../components/StoreHeader';
import CategoryBar from '../components/CategoryBar';
import StoreFooter from '../components/StoreFooter';

export default async function ProductsLayout({ children, params }) {
  const { locale } = await params;
  return (
    <>
      <AnnouncementBar locale={locale} />
      <StoreHeader locale={locale} />
      <CategoryBar locale={locale} />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
      <StoreFooter locale={locale} />
    </>
  );
}
