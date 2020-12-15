import _ from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import App from "next/app";
import Alert from "@material-ui/lab/Alert";
import { encodeForm, fetchJSON } from "src/assets/common";
import Box from "@material-ui/core/Box";
import Link from "next/link";
import { UserContext } from "src/contexts/userContext";

const useStyles = makeStyles((theme) => ({
  centerAlignOutter: {
    height: `100vh`,
    alignItems: `center`,
    display: `flex`,
  },
  centerAlignInner: {
    width: `100vw`,
    alignItems: `center`,
    display: `flex`,
    flexFlow: `column`,
  },
  panelRoot: {
    maxWidth: `600px`,
  },
}));

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
  const classes = useStyles();
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

  async function performLogin(data) {
    const res = await fetchJSON(`/api/auth/local/login`, data);
    if (res.status === 200) {
      setUser(res.json.user);
      setSessionValid(true);
      setSessionTimeLeftMS(res.json.timeLeftMS);
    } else {
      setUser({});
      setSessionValid(false);
      setSessionLastReason("Incorrect username or password. Try again!");
    }
    // }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = encodeForm(event.target);
    await performLogin(data);
  }

  return (
    <div className={classes.centerAlignOutter}>
      <div className={classes.centerAlignInner}>
        <img
          src="https://www.admenergy.com/wp-content/uploads/2018/10/logo84.png"
          alt="ADM Logo"
        />
        <Box p={2} />
        {sessionLastReason && (
          <>
            <Alert severity="error">{sessionLastReason}</Alert>
            <Box p={2} />
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
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
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
    const reply = await fetchJSON(`/api/session/check`).then(async (res) => {
      if (!res.ok) throw new Error(`[${res.status}] ${res.json ?? res.text}`); // unsure how we should handle errors
      return res.json;
    });

    switch (reply.type) {
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
