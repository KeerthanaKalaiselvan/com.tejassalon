import type { Feedback, Product, Service } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getServices(): Promise<Service[]> {
  const data = await safeFetch<{ services: Service[] }>("/api/services", { services: [] });
  return data.services;
}

export async function getProducts(): Promise<Product[]> {
  const data = await safeFetch<{ products: Product[] }>("/api/products", { products: [] });
  return data.products;
}

export async function getApprovedFeedback(): Promise<Feedback[]> {
  const data = await safeFetch<{ feedback: Feedback[] }>("/api/feedback", { feedback: [] });
  return data.feedback;
}
