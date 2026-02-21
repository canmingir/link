import { Amplify } from "aws-amplify";
import config from "../../config/config";

export function configureAmplify() {
  const { credentials } = config();

  if (!credentials) {
    throw new Error("CONFIG not initialized yet");
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: credentials.userPoolId,
        userPoolClientId: credentials.clientId,
        region: credentials.region,
        loginWith: {
          email: true,
        },
      },
    },
  });
}
