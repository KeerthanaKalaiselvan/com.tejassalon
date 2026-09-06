import type { Feedback, Product, Service } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Never throws. The marketing page must render even when the API is down —
 * a backend hiccup should degrade a section, not 500 the homepage.
 *
 * NOTE: uses an explicit AbortController rather than AbortSignal.timeout().
 * Under Next 14's patched fetch, the timeout signal's rejection can escape this
 * try/catch as an unhandledRejection and kill the response stream.
 */
async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    // cache:"no-store", NOT next:{revalidate} — Next's background revalidation
    // fetch is fire-and-forget, so when the API is down its rejection surfaces as
    // an unhandledRejection outside this try/catch and tears down the response stream.
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

export async function getServices(): Promise<Service[]> {
  const data = await safeFetch<{ services: Service[] }>("/api/services", { services: [] });
  return data?.services ?? [];
}

export async function getProducts(): Promise<Product[]> {
  const data = await safeFetch<{ products: Product[] }>("/api/products", { products: [] });
  return data?.products ?? [];
}

export async function getApprovedFeedback(): Promise<Feedback[]> {
  const data = await safeFetch<{ feedback: Feedback[] }>("/api/feedback", { feedback: [] });
  return data?.feedback ?? [];
}
