import config from "../../config/config";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

let client = null;

function getClient() {
  if (!client) {
    const { credentials } = config();
    if (!credentials) {
      throw new Error("Cognito credentials not initialized yet");
    }

    client = new CognitoIdentityProviderClient({
      region: credentials.region,
    });

    console.log("Initialized Cognito Client with region:", credentials.region);
  }

  return client;
}

export async function loginWithCognito(username, password) {
  const { credentials } = config();
  if (!credentials) {
    throw new Error("CONFIG not initialized yet. Wait for CONFIG_INITIALIZED.");
  }

  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: credentials.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const response = await getClient().send(command);
  return response.AuthenticationResult;
}
