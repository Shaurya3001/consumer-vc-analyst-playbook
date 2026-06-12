// Deterministic deep links into public ad-transparency tools.
// These are live lookups the *user* performs in their own browser - the site
// itself fetches nothing, so the offline guarantee holds.
//
// Meta Ad Library: shows every ACTIVE ad an advertiser is running (count,
// creatives, start dates, platforms). Spend/reach is only disclosed for
// political ads, so for commercial brands the honest signal is the active-ad
// COUNT and creative turnover - paid-acquisition intensity, not quality.
//
// Google Ads Transparency Center (adstransparency.google.com) keys on a
// verified advertiser domain, which the Brand schema does not carry, so no
// per-brand deep link is generated for it.

export function metaAdLibraryUrl(brandName: string): string {
  const q = encodeURIComponent(brandName);
  return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=IN&q=${q}&search_type=keyword_unordered&media_type=all`;
}

// Google News (India edition) keyword search - latest press coverage and
// wire-carried press releases for the brand, checked live by the reader.
export function googleNewsUrl(brandName: string): string {
  const q = encodeURIComponent(`"${brandName}"`);
  return `https://news.google.com/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`;
}
