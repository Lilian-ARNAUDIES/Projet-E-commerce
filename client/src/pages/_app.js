import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/globals.css';
import Navbar from '../components/navbar';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar /> {}
      <Component {...pageProps} />
      {/* <Footer /> {} */}
    </>
  );
}