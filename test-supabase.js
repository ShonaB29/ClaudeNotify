require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {

    const { data, error } = await supabase
        .from("devices")
        .select("*");

    if (error) {
        console.error("❌ Supabase error:", error);
        return;
    }

    console.log("✅ Supabase connected!");
    console.log("Devices:", data);
}

test();