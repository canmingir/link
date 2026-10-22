export const APP_VERSION =
  typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "DEV";

export const APP_VERSION_LABEL =
  APP_VERSION === "DEV" ? APP_VERSION : `v${APP_VERSION}`;
