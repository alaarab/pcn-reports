import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "components/NavBar";
import Container from "react-bootstrap/Container";
import Session from "components/Session";
import "styles/globals.css";

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
