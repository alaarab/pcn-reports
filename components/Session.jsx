import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import App from "next/app";
import Link from "next/link";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Jumbotron,
  Row,
} from "react-bootstrap";
import axios from "axios";
import { useInput } from "hooks/useInput";
import { createContext } from "react";
const UserContext = createContext(null);

function SessionActive(props) {
  const [invertalPerformCheck, setIntervalPerformCheck] = useState(null);

  useEffect(() => {
    setIntervalPerformCheck(
      setInterval(() => {
        props.performCheck();
      }, 60000)
    );
  }, []);

  return props.children;
}

function LoginModal(props) {
  const {
    user,
    setUser,
    sessionValid,
    setSessionValid,
    sessionLastReason,
    setSessionLastReason,
    sessionTimeLeftMS,
    setSessionTimeLeftMS,
  } = useContext(UserContext);
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    performLogin();
    resetEmail();
    resetPassword();
  };

  async function performLogin() {
    axios
      .post(`/api/auth/local/login`, { email, password })
      .then(function (res) {
        if (res.status === 200) {
          setUser(res.data.user);
          setSessionValid(true);
          setSessionTimeLeftMS(res.data.timeLeftMS);
        } else {
          setUser({});
          setSessionValid(false);
          setSessionLastReason("Incorrect username or password. Try again!");
        }
      });
  }

  return (
    <Container>
      <Jumbotron>
        <h1>PCN Patient Lookup</h1>
      </Jumbotron>
      <Row className="align-items-center">
        <Col className="p-3">
          {sessionLastReason && (
            <>
              <Alert severity="error">{sessionLastReason}</Alert>
            </>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                required={true}
                {...bindEmail}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                {...bindPassword}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

function Session(props) {
  const [user, setUser] = useState({});
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [sessionTimeLeftMS, setSessionTimeLeftMS] = useState(0);
  const [sessionLastReason, setSessionLastReason] = useState("");
  const userProviderValue = useMemo(
    () => ({
      user,
      setUser,
      sessionValid,
      setSessionValid,
      sessionLastReason,
      setSessionLastReason,
      sessionTimeLeftMS,
      setSessionTimeLeftMS,
    }),
    [
      user,
      setUser,
      sessionValid,
      setSessionValid,
      sessionLastReason,
      setSessionLastReason,
      sessionTimeLeftMS,
      setSessionTimeLeftMS,
    ]
  );

  async function performCheck() {
    const reply = await axios(`/api/session/check`);

    switch (reply.data.type) {
      case "SESSION_CHECK_DONE":
        setUser(reply.data.user);
        setSessionValid(reply.data.valid);
        setSessionLoading(false);
        setSessionTimeLeftMS(reply.data.timeLeftMS);
        return;
      default:
        throw new Error(`[todo] unimplemented`);
    }
  }

  useEffect(() => {
    performCheck();
  }, []);

  return (
    <UserContext.Provider value={userProviderValue}>
      {sessionLoading && <>{/* <CircularProgress /> */}</>}
      {!sessionLoading && sessionValid && (
        <SessionActive performCheck={performCheck}>
          {props.children}
        </SessionActive>
      )}
      {!sessionLoading && !sessionValid && <LoginModal />}
    </UserContext.Provider>
  );
}

export default Session;
