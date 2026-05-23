import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '../../i18n';
import '../globals.css';
import './components/Toast.css';
import { ToastProvider } from './components/ToastProvider';
import PageTransition from './components/PageTransition';
import ThemeInitializer from './components/ThemeInitializer';
import MaintenanceGate from './components/MaintenanceGate';
import { Providers } from './context/Providers';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? 'ضياء ستور — اشتراكات رقمية مميزة' : 'Diaa Store — Premium Digital Subscriptions',
    description: locale === 'ar'
      ? 'احصل على اشتراكات رقمية بأفضل الأسعار. ChatGPT Plus, Adobe CC, Spotify والمزيد.'
      : 'Get premium digital subscriptions at the best prices. ChatGPT Plus, Adobe CC, Spotify and more.',
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} lang={locale} data-theme="dark">
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <ToastProvider>
            <ThemeInitializer />
            <MaintenanceGate>
              <PageTransition>
                {children}
              </PageTransition>
            </MaintenanceGate>
          </ToastProvider>
        </Providers>
      </NextIntlClientProvider>
    </div>
  );
}
