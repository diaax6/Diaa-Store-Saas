import AdminLayout from './AdminLayout';

export default async function AdminRootLayout({ children, params }) {
  const { locale } = await params;
  return <AdminLayout locale={locale}>{children}</AdminLayout>;
}
