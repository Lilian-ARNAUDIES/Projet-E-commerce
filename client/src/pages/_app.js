import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import Head from 'next/head';
// import '../styles/globals.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function MyApp({ Component, pageProps }) {
  

  return (
    <div className="d-flex flex-column min-vh-100">
      <Head>
        <script src="/tarteaucitron/tarteaucitron.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tarteaucitron.init({
              "privacyUrl": "/legal/confidentialite",
              "hashtag": "#tarteaucitron",
              "cookieName": "tarteaucitron",
              "orientation": "bottom",
              "showAlertSmall": true,
              "cookieslist": true,
              "adblocker": false,
              "highPrivacy": true,
              "handleBrowserDNTRequest": false,
              "removeCredit": false,
              "moreInfoLink": true,
              "useExternalCss": false,
              "readmoreLink": "/legal/confidentialite"
            });
          `
        }} />
      </Head>
      <Navbar />
      <main className="flex-grow-1 container my-5">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}