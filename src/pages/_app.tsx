import "@/styles/globals.css";

export default function App({ Component, pageProps } : any) {
  // If page layout is available, use it. Else return the page
  const getLayout = Component.getLayout || ((page : any) => page);
  return getLayout(<Component {...pageProps} />);
}
