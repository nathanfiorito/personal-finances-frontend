import { createClient } from "@supabase/supabase-js";

// Load .env if running locally
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config();
} catch {
  // dotenv not available — rely on actual env vars
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing required env vars: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const args = process.argv.slice(2);
const email = args[0] || process.env.SEED_USER_EMAIL;
const password = args[1] || process.env.SEED_USER_PASSWORD;

if (!email || !password) {
  console.error("Usage: ts-node scripts/seed-user.ts <email> <password>");
  console.error("Or set SEED_USER_EMAIL and SEED_USER_PASSWORD environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedUser() {
  console.log(`Syncing user: ${email}`);

  // Always look up by email first and upsert
  const listResult = await supabase.auth.admin.listUsers();
  if (listResult.error) {
    console.error("Failed to list users:", listResult.error.message);
    process.exit(1);
  }

  const existing = listResult.data?.users.find((u) => u.email === email);

  if (existing) {
    console.log(`User already exists (id: ${existing.id}). Updating password...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password: password as string,
      email_confirm: true,
    });
    if (updateError) {
      console.error("Failed to update password:", updateError.message);
      process.exit(1);
    }
    console.log("Password updated successfully.");
    console.log("  ID:", existing.id);
    console.log("  Email:", existing.email);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email as string,
      password: password as string,
      email_confirm: true,
    });
    if (error) {
      console.error("Failed to create user:", error.message);
      process.exit(1);
    }
    console.log("User created successfully!");
    console.log("  ID:", data.user?.id);
    console.log("  Email:", data.user?.email);
  }
}

seedUser();
