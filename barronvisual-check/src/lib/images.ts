import "server-only";
import type { ImageInput } from "@/lib/ai/generate";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Comprueba la firma real del archivo (no solo la extensión) y lo pasa a base64. */
export async function readImage(file: File): Promise<ImageInput & { bytes: Buffer }> {
  if (file.size === 0) throw new Error("La imagen está vacía.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("La imagen pesa más de 5 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());

  let mediaType: ImageInput["mediaType"] | null = null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) mediaType = "image/jpeg";
  else if (bytes.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) mediaType = "image/png";
  else if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") mediaType = "image/webp";
  if (!mediaType) throw new Error("Formato no admitido. Usa JPG, PNG o WebP.");

  return { mediaType, base64: bytes.toString("base64"), bytes };
}

export const extensionFor = (t: ImageInput["mediaType"]) => (t === "image/png" ? "png" : t === "image/webp" ? "webp" : "jpg");
