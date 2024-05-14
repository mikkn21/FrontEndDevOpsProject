import { loginResponse } from "../pages/login/login";

export function getCookieUsername(): string | null {
  return extractCookieInformation(1);
}

export function getCookieRole(): string | null {
  return extractCookieInformation(2);
}

export function getCookieId(): string | null {
  return extractCookieInformation(3);
}

function extractCookieInformation(i: number): string | null {
  const authToken = loginResponse.token;
  if (authToken) {
    const parts = authToken.split("|");
    return parts[i];
  }
  return null;
}

// Fetches cookie by name from the browser
export function getCookie(): string | undefined {
  return loginResponse.token;
}
