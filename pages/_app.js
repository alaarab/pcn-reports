import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "components/NavBar";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar/>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
