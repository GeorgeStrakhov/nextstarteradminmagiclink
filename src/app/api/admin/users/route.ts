import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/auth";

export async function GET() {
  const session = await auth();

  // Check if user is admin
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        isAdmin: users.isAdmin,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .orderBy(users.email);

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
