export const DEFAULT_SITE_URL = "https://shakilabs.com/travel";

/** 프로토콜 + 호스트 + 베이스 경로(trailing slash 제거) */
export function getCanonicalSiteUrl(): string {
  return DEFAULT_SITE_URL.replace(/\/+$/, "");
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * 런타임 origin + canonical base path 를 조합하여 사이트 URL 반환.
 * SSG 빌드 시(window 없음)에는 canonical URL 을 그대로 사용한다.
 */
export function getSiteUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    const basePath = new URL(getCanonicalSiteUrl()).pathname.replace(/\/+$/, "");
    return trimTrailingSlash(`${window.location.origin}${basePath}`);
  }
  return getCanonicalSiteUrl();
}

/**
 * canonical URL + path + queryString + hash 를 조합하여 절대 URL 생성.
 */
export function buildCanonicalUrl(path: string, queryString = "", hash = ""): string {
  const baseUrl = new URL(getCanonicalSiteUrl());
  const basePath = baseUrl.pathname.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  baseUrl.pathname = `${basePath}${normalizedPath}`;
  baseUrl.search = queryString ? `?${queryString.replace(/^\?/, "")}` : "";
  baseUrl.hash = hash ? `#${hash.replace(/^#/, "")}` : "";
  return baseUrl.toString();
}
