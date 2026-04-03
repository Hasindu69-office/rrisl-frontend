import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getGlobalLayout, getStrapiImageUrl } from "@/app/lib/strapi";

export const revalidate = 60;

const FALLBACK_FAVICON_PATH = path.join(process.cwd(), "app", "favicon.ico");

async function getFallbackFaviconResponse(): Promise<NextResponse> {
  const fallbackBuffer = await readFile(FALLBACK_FAVICON_PATH);

  return new NextResponse(new Uint8Array(fallbackBuffer), {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}

export async function GET(): Promise<NextResponse> {
  try {
    const globalLayout = await getGlobalLayout("en");
    const faviconUrl = getStrapiImageUrl(globalLayout?.favicon);

    if (!faviconUrl) {
      return getFallbackFaviconResponse();
    }

    const response = await fetch(faviconUrl, {
      next: { revalidate },
    });

    if (!response.ok) {
      return getFallbackFaviconResponse();
    }

    const contentType = response.headers.get("content-type") || globalLayout?.favicon?.mime || "image/png";
    const faviconBuffer = await response.arrayBuffer();

    return new NextResponse(faviconBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error serving favicon:", error);
    return getFallbackFaviconResponse();
  }
}
