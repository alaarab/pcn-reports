import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar />
      <Container className="p-3">
        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default MyApp;
