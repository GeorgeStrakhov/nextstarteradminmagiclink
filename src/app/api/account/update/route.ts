import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, image } = await req.json();

    // Validate input
    if (typeof name !== "string" && name !== undefined) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    if (typeof image !== "string" && image !== undefined) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData: { name?: string; image?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;

    // Update user in database
    await db.update(users).set(updateData).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account update error:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 },
    );
  }
}
