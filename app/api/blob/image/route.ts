import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { getBlobReadWriteToken } from "@/app/lib/blob/env";
import { isProductImageBlobPathname } from "@/app/lib/blob/blob-image-api-path";

export const runtime = "nodejs";

const normalizePathnameParam = (raw: string | null): string | null => {
  if (raw === null || raw === "") {
    return null;
  }
  let pathname = raw.trim();
  while (pathname.includes("%")) {
    try {
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) {
        break;
      }
      pathname = decoded;
    } catch {
      break;
    }
  }
  return pathname;
};

export async function GET(request: Request): Promise<Response> {
  const pathnameRaw = new URL(request.url).searchParams.get("pathname");
  const pathname = normalizePathnameParam(pathnameRaw);
  if (pathname === null || !isProductImageBlobPathname(pathname)) {
    return new NextResponse(null, { status: 404 });
  }
  const token = getBlobReadWriteToken();
  if (token === undefined) {
    return new NextResponse(null, { status: 503 });
  }
  const result = await get(pathname, { access: "private", token });
  if (result === null) {
    return new NextResponse(null, { status: 404 });
  }
  if (result.statusCode === 304) {
    return new NextResponse(null, { status: 304 });
  }
  const headers = new Headers();
  headers.set("Content-Type", result.blob.contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new NextResponse(result.stream, { status: 200, headers });
}
