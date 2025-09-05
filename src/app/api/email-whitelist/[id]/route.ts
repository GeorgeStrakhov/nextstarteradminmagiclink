import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { emailWhitelist } from "@/db/schema/email-whitelist";
import { eq } from "drizzle-orm";

interface Context {
  params: Promise<{ id: string }>;
}

// DELETE /api/email-whitelist/[id] - Remove email from whitelist
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const [deletedEmail] = await db
      .delete(emailWhitelist)
      .where(eq(emailWhitelist.id, id))
      .returning();

    if (!deletedEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing email from whitelist:", error);
    return NextResponse.json(
      { error: "Failed to remove email from whitelist" },
      { status: 500 },
    );
  }
}

// PATCH /api/email-whitelist/[id] - Update email notes
export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { notes } = body;

    const [updatedEmail] = await db
      .update(emailWhitelist)
      .set({ notes: notes || null })
      .where(eq(emailWhitelist.id, id))
      .returning();

    if (!updatedEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEmail);
  } catch (error) {
    console.error("Error updating email whitelist:", error);
    return NextResponse.json(
      { error: "Failed to update email whitelist" },
      { status: 500 },
    );
  }
}
