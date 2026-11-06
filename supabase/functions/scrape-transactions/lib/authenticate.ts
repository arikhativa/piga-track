export async function authenticate(request: Request): Promise<boolean> {
  const expectedSecret = Deno.env.get("SCRAPE_CRON_SECRET");
  const incomingSecret = request.headers.get("x-cron-secret");

  if (!expectedSecret || !incomingSecret) {
    return false;
  }

  // Hash both values so the comparison always processes fixed-length buffers.
  const encoder = new TextEncoder();
  const [expectedHash, incomingHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(expectedSecret)),
    crypto.subtle.digest("SHA-256", encoder.encode(incomingSecret)),
  ]);

  const expectedBytes = new Uint8Array(expectedHash);
  const incomingBytes = new Uint8Array(incomingHash);
  let difference = 0;

  for (let index = 0; index < expectedBytes.length; index++) {
    difference |= expectedBytes[index] ^ incomingBytes[index];
  }

  return difference === 0;
}
