import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import config from "../../config/config";

const { credentials } = config();
console.log("Cognito credentials:", credentials);

const client = new CognitoIdentityProviderClient({
  region: credentials.region,
});

export async function loginWithCognito(username, password) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: credentials.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const response = await client.send(command);
  return response.AuthenticationResult;
}
