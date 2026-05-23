import StoreHeader from '../components/StoreHeader';
import StoreFooter from '../components/StoreFooter';

export default async function CheckoutLayout({ children, params }) {
  const { locale } = await params;
  return (
    <>
      <StoreHeader locale={locale} />
      <main>{children}</main>
      <StoreFooter locale={locale} />
    </>
  );
}
