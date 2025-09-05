import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  // Check if user is admin
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isAdmin } = await req.json();
    const { id: userId } = await params;

    // Validate input
    if (typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isAdmin value" },
        { status: 400 },
      );
    }

    // Prevent users from removing their own admin status
    if (session.user.id === userId && !isAdmin) {
      return NextResponse.json(
        { error: "You cannot remove your own admin privileges" },
        { status: 400 },
      );
    }

    // Update user admin status
    await db.update(users).set({ isAdmin }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
