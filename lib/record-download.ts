"use client";

const DOWNLOAD_COUNTED_KEY = "blockify:download-counted";
const DOWNLOAD_ENDPOINT = "/api/site-metrics/download";

/**
 * Records an APK download. Called from the download buttons' onClick.
 *
 * The click immediately navigates the browser to the (cross-origin) APK URL,
 * which can cancel an in-flight `fetch`. `navigator.sendBeacon` is designed for
 * exactly this — it hands the request to the browser to send in the background.
 * We fall back to `fetch` with `keepalive` where sendBeacon is unavailable.
 *
 * A per-session `sessionStorage` flag prevents double-counting when a user
 * clicks a download button more than once in the same session.
 */
export function recordDownload(): void {
  try {
    if (window.sessionStorage.getItem(DOWNLOAD_COUNTED_KEY) === "1") {
      return;
    }
    window.sessionStorage.setItem(DOWNLOAD_COUNTED_KEY, "1");
  } catch {
    // Ignore storage errors and still attempt to record the download.
  }

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(DOWNLOAD_ENDPOINT);
      return;
    }
  } catch {
    // Fall through to fetch below.
  }

  try {
    void fetch(DOWNLOAD_ENDPOINT, {
      method: "POST",
      keepalive: true,
      cache: "no-store",
    });
  } catch {
    // Best-effort — never block the actual download.
  }
}
