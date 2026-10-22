import {
  confirmResetPassword,
  confirmSignUp,
  fetchAuthSession,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";

export async function login(email: string, password: string) {
  return signIn({ username: email, password });
}

export async function signup(email: string, password: string) {
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

export async function confirmSignup(email: string, code: string) {
  return confirmSignUp({
    username: email,
    confirmationCode: code,
  });
}

export async function forgotPassword(email: string) {
  return resetPassword({ username: email });
}

export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
) {
  return confirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  });
}

export async function logout() {
  await signOut({ global: true });
}

export async function getTokens() {
  const session = await fetchAuthSession();

  const tokens = session.tokens;

  return {
    accessToken: tokens?.accessToken?.toString(),
    refreshToken: undefined as string | undefined,
    idToken: tokens?.idToken?.toString(),
  };
}
