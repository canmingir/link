const config = {
  project: {
    oauth: {
      tokenUrl: "https://github.com/login/oauth/access_token",
      userUrl: "https://api.github.com/user",
      clientId: "0c2844d3d19dc9293fc5",
      jwt: {
        identifier: "id",
      },
    },
  },
};

const mockPermission = {
  userId: "1001",
  projectId: "d6b6e9a3-403d-4ad8-a40a-0f8d613a0750",
  appId: "ce68d9b8-46c1-46be-83fd-e7b0f7803e2e",
  organizationId: "b75ad28c-6c02-486d-864e-a04a3725aea0",
  role: "OWNER",
};

const JWT_SECRET = "q8fvthcTaz8qKQDAS7hJRK"

const OAUTH_CLIENT_SECRET = "53b08fe45a3c616a9ce3e05174ea82e502df6baf"

//eslint-disable-next-line
module.exports = { config, mockPermission, JWT_SECRET, OAUTH_CLIENT_SECRET };
