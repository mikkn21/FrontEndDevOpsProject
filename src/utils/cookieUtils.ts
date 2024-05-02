import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


export const TOKEN_NAME = "authToken";

interface DecodedToken {
  role?: string;
  exp?: number; // The standard claim for expiration (optional)
  [key: string]: any;
  // Define other expected properties from the token payload if necessary
}

export function getCookieUsername(): string | null {
  return extractCookieInformation(1);
}

export function getCookieRole(): string | null {
  return extractCookieInformation(2);
}

function extractCookieInformation(i: number): string | null {
  const authToken = Cookies.get(TOKEN_NAME);
  if (authToken) {
    const parts = authToken.split("|");
    if (parts.length > 1 && parts[0] === TOKEN_NAME && parts.length > i) {
      return parts[i];
      // username = parts[1]
      // role = parts[2]
    }
  }
  return null; 
}



// Fetches the JWT from a cookie and decodes it
export function getDecodedToken(tokenName: string): DecodedToken | null {
    const token = getCookie(tokenName);
    if (token) {
      try {
        // Decoding the JWT
        const decodedToken: DecodedToken = jwtDecode(token);
        // Optional: Check if the token has expired
        if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
          console.warn('Token has expired');
          return null;
        }
        return decodedToken;
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    }
    return null;
  }

// Fetches cookie by name from the browser
export function getCookie(name: string): string | undefined {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }


// Utility function to extract specific data from the decoded JWT
export function getPropertyFromToken<T extends string>(tokenName: string, propertyName: T): DecodedToken[T] | string { 
  const decodedToken = getDecodedToken(tokenName);

  if (!decodedToken || !decodedToken.hasOwnProperty(propertyName)) {
    throw new Error(`Property '${propertyName}' not found in the JWT`);
  }

  return decodedToken[propertyName] as DecodedToken[T] || 'guest'; 
}