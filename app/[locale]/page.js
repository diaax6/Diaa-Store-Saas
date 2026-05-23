import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import AnnouncementBar from './components/AnnouncementBar';
import StoreHeader from './components/StoreHeader';
import CategoryBar from './components/CategoryBar';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import StatsSection from './components/StatsSection';
import StoreFooter from './components/StoreFooter';
import TrustBadges from './components/TrustBadges';
import LiveSalesTicker from './components/LiveSalesTicker';
import ScrollProgress from './components/ScrollProgress';
import CookieConsent from './components/CookieConsent';
import FloatingSupport from './components/FloatingSupport';
import QuickSearch from './components/QuickSearch';
import FlashDealBanner from './components/FlashDealBanner';

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <AnnouncementBar locale={locale} />
      <StoreHeader locale={locale} />
      <CategoryBar locale={locale} />
      <main>
        <HeroSection locale={locale} />
        <TrustBadges locale={locale} />
        <FlashDealBanner locale={locale} />
        <FeaturedProducts locale={locale} />
        <StatsSection locale={locale} />
      </main>
      <StoreFooter locale={locale} />
      <LiveSalesTicker locale={locale} />
      <FloatingSupport locale={locale} />
      <CookieConsent locale={locale} />
      <QuickSearch locale={locale} />
    </>
  );
}
