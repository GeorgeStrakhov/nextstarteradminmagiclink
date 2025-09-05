import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { emailWhitelist } from "@/db/schema/email-whitelist";
import { desc } from "drizzle-orm";

// GET /api/email-whitelist - Get all whitelisted emails
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emails = await db
      .select()
      .from(emailWhitelist)
      .orderBy(desc(emailWhitelist.createdAt));

    return NextResponse.json(emails);
  } catch (error) {
    console.error("Error fetching email whitelist:", error);
    return NextResponse.json(
      { error: "Failed to fetch email whitelist" },
      { status: 500 },
    );
  }
}

// POST /api/email-whitelist - Add email to whitelist
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, notes } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const [newEmail] = await db
      .insert(emailWhitelist)
      .values({
        email: email.toLowerCase().trim(),
        notes: notes || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(newEmail);
  } catch (error) {
    console.error("Error adding email to whitelist:", error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json(
        { error: "Email is already whitelisted" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to add email to whitelist" },
      { status: 500 },
    );
  }
}
