import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Pages that should not show header/footer
  const noLayoutPages = ['/login', '/dashboard', '/admin/dashboard', '/client/portal'];
  const showLayout = !noLayoutPages.includes(router.pathname);

  return (
    <AuthProvider>
      {showLayout && <Header />}
      <div className={showLayout ? "pt-12" : ""}>
        <Component {...pageProps} />
      </div>
      {showLayout && <Footer />}
    </AuthProvider>
  );
}