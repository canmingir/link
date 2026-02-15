import {
  confirmSignUp,
  fetchAuthSession,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";

export async function login(username, password) {
  return signIn({ username, password });
}

export async function signup(username, password, email) {
  return signUp({
    username,
    password,
    options: {
      userAttributes: {
        email,
      },
    },
  });
}

export async function confirmSignup(username, code) {
  return confirmSignUp({
    username,
    confirmationCode: code,
  });
}

export async function logout() {
  await signOut();
}

export async function getTokens() {
  const session = await fetchAuthSession();

  return {
    accessToken: session.tokens?.accessToken?.toString(),
    refreshToken: session.tokens?.refreshToken?.toString(),
    idToken: session.tokens?.idToken?.toString(),
  };
}
