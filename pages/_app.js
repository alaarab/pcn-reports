import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Session from "components/Session";
import "styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Session>
        <NavBar />
        <Container className="p-3">
          <Component {...pageProps} />
        </Container>
      </Session>
    </>
  );
}

export default MyApp;
