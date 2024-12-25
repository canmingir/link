const jsonServer = require("json-server");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const axios = require("axios");

const { mockPermission, config ,JWT_SECRET,OAUTH_CLIENT_SECRET} = require("./oauthMock");

const server = jsonServer.create();
const router = jsonServer.router("mock.json");
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(cors());


server.post("/oauth", async (req, res) => {
  let { appId, projectId, code, refreshToken, redirectUri } = req.body;
   
  if (!code && !refreshToken) {
    return res.status(400).send("Missing OAuth Code and Refresh Token");
  }
  if (code && redirectUri) {
    const params = new URLSearchParams();
    params.append("client_id", config.project.oauth.clientId);
    params.append("client_secret", OAUTH_CLIENT_SECRET);
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("grant_type", "authorization_code");

    const { data } = await axios.post(
      config.project.oauth.tokenUrl,
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log(data);  

    const urlParams = new URLSearchParams(data);

    if (urlParams.get("error")) {
      throw new Error(urlParams.get("error_description"));
    }

    refreshToken = urlParams.get("access_token");
  }

  const { userId, role, organizationId } = mockPermission;

  let accessToken;

  if (projectId) {
    accessToken = jwt.sign(
      {
        sub: userId,
        iss: "nuc",
        aud: projectId,
        oid: organizationId,
        aid: appId,
        rls: role,
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
  } else {
    accessToken = jwt.sign(
      { sub: userId, iss: "nuc", aid: appId },
      JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );
  }

  res.status(200).json({ accessToken, refreshToken });
});

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});
