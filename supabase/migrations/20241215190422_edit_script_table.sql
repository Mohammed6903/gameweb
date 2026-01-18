DROP TABLE IF EXISTS adsense_scripts CASCADE;
CREATE TABLE adsense_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    element JSONB NOT NULL,
    position TEXT NOT NULL DEFAULT 'after' CHECK (position IN ('before', 'after')), -- Default position
    script TEXT NOT NULL,      -- The JavaScript code to inject
    description TEXT,          -- Optional description for the script
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


ALTER TABLE adsense_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin users to do anything on ads" ON "public"."adsense_scripts" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));