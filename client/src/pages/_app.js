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
        <title>Boutique FitGear - Matériel, Haltères, Machines</title>
        <meta name="description" content="Boutique spécialisée en matériel de musculation : haltères, poids, machines et équipements professionnels. Livraison rapide et service client réactif." />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Lilian Arnaudies" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="musculation, fitness, haltères, matériel de sport, poids, machine, entraînement" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WBYK81WGWG"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WBYK81WGWG');
            `,
          }}
        />
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