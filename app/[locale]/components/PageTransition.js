'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setIsTransitioning(true);
      // Short fade out, then swap children, then fade in
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
        prevPath.current = pathname;
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [children, pathname]);

  return (
    <div className={`page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      {displayChildren}
    </div>
  );
}
