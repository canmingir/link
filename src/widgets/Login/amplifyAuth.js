import {
  confirmSignUp,
  fetchAuthSession,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";

export async function login(email, password) {
  return signIn({ username: email, password });
}

export async function signup(email, password) {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
      },
    },
  });
}

export async function confirmSignup(email, code) {
  return confirmSignUp({
    username: email,
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
