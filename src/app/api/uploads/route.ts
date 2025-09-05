import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/services/s3/s3";
import { auth } from "@/lib/auth";

export const maxDuration = 60; // Maximum allowed duration for Vercel Pro

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Add error handling for formData parsing
    let formData;
    try {
      formData = await req.formData();
    } catch (parseError) {
      console.error("Failed to parse form data:", parseError);
      return NextResponse.json(
        {
          error:
            "Failed to parse upload data. File may be too large for this platform.",
        },
        { status: 413 },
      );
    }
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size - 50MB for Vercel Pro
    const maxSize = process.env.MAX_UPLOAD_SIZE
      ? parseInt(process.env.MAX_UPLOAD_SIZE)
      : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
        },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "text/markdown",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const uploadResult = await uploadFile(file, file.name, {
      folder: `uploads`,
      contentType: file.type,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ publicUrl: uploadResult.publicUrl });
  } catch (error) {
    console.error("Upload API error:", error);
    // More detailed error message
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
