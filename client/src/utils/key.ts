import db from "../database";
import tables from "../database/tables";

export async function generateKey(id: number) {
    const encoder = new TextEncoder();

    const key = encoder.encode(process.env.KEY!);
    const message = encoder.encode(id.toString());

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );

    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        message,
    );

    const signatureArray = new Uint8Array(signatureBuffer);
    const signatureHex = [...signatureArray]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return signatureHex;
}

export async function generateToken(id: number) {
    let key = await generateKey(id);
    let raw = `${id};${key}`;
    let encoded = Buffer.from(raw, "ascii").toString("base64");
    return encoded;
}
