import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
    const { email, name } = await request.json();

    const users = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));
    
    if (users?.length == 0) {
        const result = await db.insert(usersTable).values({
            name: name,
            email: email
            
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        }).returning(usersTable);

        console.log("New user created:", result);
        return NextResponse.json(result[0]);
    }
    
    return NextResponse.json(users[0]);
}