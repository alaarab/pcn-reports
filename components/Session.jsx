import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import App from "next/app";
import Link from "next/link";
import { UserContext } from "contexts/userContext";
import { Alert, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useInput } from "hooks/useInput";

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
    <div>
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

      {/* <Card
          className={classes.panelRoot}
          component="form"
          onSubmit={handleSubmit}
        >
          <CardContent>
            <Typography variant="h5">Staff Login</Typography>

            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              required={true}
              error={false}
              helperText=""
              onChange={onChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              required={true}
              error={false}
              helperText=""
              onChange={onChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      edge="end"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </CardContent>
          <Divider variant="middle" />
          <CardActions style={{ justifyContent: "center" }}>
            <Grid container justify="center">
              <center>
                <Button type="submit" color="primary" variant="contained">
                  Sign In
                </Button>
                <Box fontWeight="fontWeightBold">OR</Box>
                <Link href={{ pathname: "/api/auth/azure/login" }}>
                  <Button variant="outlined">Sign in with Microsoft</Button>
                </Link>
              </center>
            </Grid>
          </CardActions>
        </Card> */}
    </div>
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
        setUser(reply.user);
        setSessionValid(reply.valid);
        setSessionLoading(false);
        setSessionTimeLeftMS(reply.timeLeftMS);
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
      {sessionLoading && (
        <div
          style={{
            height: "100vh",
            alignItems: "center",
            display: "flex",
          }}
        >
          <div
            style={{
              width: "100vw",
              alignItems: "center",
              display: "flex",
              flexFlow: "column",
            }}
          >
            {/* <CircularProgress /> */}
          </div>
        </div>
      )}
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
