import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

/**
 * Shared store layout for public pages (track, help, status, docs, changelog, etc.)
 * This ensures every public page ALWAYS has the store header and footer.
 * To use: import in any route's layout.js:
 *   import PublicLayout from '../components/PublicLayout';
 *   export default PublicLayout;
 */
export default async function PublicLayout({ children, params }) {
  const { locale } = await params;
  return (
    <>
      <StoreHeader locale={locale} />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>{children}</main>
      <StoreFooter locale={locale} />
    </>
  );
}
