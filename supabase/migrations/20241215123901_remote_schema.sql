

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "domain_access";


ALTER SCHEMA "domain_access" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium";





COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_permission" AS ENUM (
    'games.delete',
    'games.insert',
    'games.update',
    'providers.delete',
    'providers.update',
    'providers.insert',
    'users.select',
    'users.delete',
    'users.update',
    'games.select',
    'providers.select',
    'tags.select',
    'tags.delete',
    'tags.update',
    'tags.insert',
    'categories.insert',
    'categories.update',
    'categories.delete',
    'categories.select'
);


ALTER TYPE "public"."app_permission" OWNER TO "postgres";


CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'moderator',
    'user'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Fetch user role once and store it to reduce number of calls
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  select count(*)
  into bind_permissions
  from public.role_permissions
  where role_permissions.permission = requested_permission
    and role_permissions.role = user_role;

  return bind_permissions > 0;
end;
$$;


ALTER FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    AS $$
  declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Fetch the user role in the user_roles table
    select role into user_role from public.user_roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_lowercase_categories_tags"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.categories := ARRAY(SELECT LOWER(category) FROM unnest(NEW.categories) AS category); -- Convert category to lowercase
  NEW.tags := ARRAY(SELECT LOWER(tag) FROM unnest(NEW.tags) AS tag); -- Convert each tag to lowercase
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."enforce_lowercase_categories_tags"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_role"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_categories_and_tags"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Insert categories into public.categories
    IF NEW.categories IS NOT NULL THEN
        INSERT INTO public.categories (category)
        SELECT UNNEST(NEW.categories)
        ON CONFLICT (category) DO NOTHING; -- Avoid duplicates
    END IF;

    -- Insert tags into public.tags
    IF NEW.tags IS NOT NULL THEN
        INSERT INTO public.tags (tag)
        SELECT UNNEST(NEW.tags)
        ON CONFLICT (tag) DO NOTHING; -- Avoid duplicates
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."insert_categories_and_tags"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_timestamps"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at = now();
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_timestamps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_timestamps_with_only_created"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at = now();
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_timestamps_with_only_created"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.name || ' ' || NEW.description || ' ' || array_to_string(NEW.tags, ' '));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_search_vector"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "domain_access"."Domain" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "domain" "text" NOT NULL
);


ALTER TABLE "domain_access"."Domain" OWNER TO "postgres";


ALTER TABLE "domain_access"."Domain" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "domain_access"."Domain_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."ad_settings" (
    "id" bigint NOT NULL,
    "google_client_id" "text" NOT NULL,
    "carousel_ad_frequency" integer NOT NULL,
    "carousel_ad_slot" "text" NOT NULL,
    "carousel_ad_format" "text" NOT NULL,
    "carousel_ad_full_width" boolean NOT NULL,
    "sidebar_ad_slot" "text" NOT NULL,
    "sidebar_ad_format" "text" NOT NULL,
    "sidebar_ad_full_width" boolean NOT NULL,
    "game_view_ad_slot" "text" NOT NULL,
    "game_view_ad_format" "text" NOT NULL,
    "game_view_ad_full_width" boolean NOT NULL,
    "comment_section_ad_slot" "text" NOT NULL,
    "comment_section_ad_format" "text" NOT NULL,
    "comment_section_ad_full_width" boolean NOT NULL,
    "show_carousel_ads" boolean NOT NULL,
    "show_sidebar_ads" boolean NOT NULL,
    "show_game_view_ads" boolean NOT NULL,
    "show_comment_section_ads" boolean NOT NULL,
    "sidebar_ad_count" integer NOT NULL
);


ALTER TABLE "public"."ad_settings" OWNER TO "postgres";


ALTER TABLE "public"."ad_settings" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."ad_settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category" "text" NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_sequence"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE "public"."categories_id_sequence" OWNER TO "postgres";


ALTER SEQUENCE "public"."categories_id_sequence" OWNED BY "public"."categories"."id";



CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "game_id" integer NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."comments_id_seq" OWNED BY "public"."comments"."id";



CREATE TABLE IF NOT EXISTS "public"."contact_info" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "address" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "form_title" "text" NOT NULL,
    "form_description" "text" NOT NULL,
    "social_title" "text" NOT NULL,
    "social_links" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."contact_info" OWNER TO "postgres";


ALTER TABLE "public"."contact_info" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."contact_info_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."emailUser" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL
);


ALTER TABLE "public"."emailUser" OWNER TO "postgres";


COMMENT ON TABLE "public"."emailUser" IS 'Data for uses signed in using email';



CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "thumbnail_url" "text",
    "play_url" "text" NOT NULL,
    "provider_id" integer,
    "categories" "text"[],
    "tags" "text"[],
    "is_active" boolean DEFAULT true,
    "search_vector" "tsvector",
    "created_at" timestamp without time zone,
    "updated_at" timestamp without time zone
);


ALTER TABLE "public"."games" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."games_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."games_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."games_id_seq" OWNED BY "public"."games"."id";



CREATE TABLE IF NOT EXISTS "public"."likes_dislikes" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "game_id" integer NOT NULL,
    "is_like" boolean NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."likes_dislikes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."likes_dislikes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."likes_dislikes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."likes_dislikes_id_seq" OWNED BY "public"."likes_dislikes"."id";



CREATE TABLE IF NOT EXISTS "public"."pages" (
    "id" bigint NOT NULL,
    "slug" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."pages" OWNER TO "postgres";


ALTER TABLE "public"."pages" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."pages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."providers" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "url" "text" NOT NULL,
    "description" "text",
    "logo_url" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone,
    "updated_at" timestamp without time zone
);


ALTER TABLE "public"."providers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."providers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."providers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."providers_id_seq" OWNED BY "public"."providers"."id";



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" bigint NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "permission" "public"."app_permission" NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_permissions" IS 'Application permissions for each role.';



ALTER TABLE "public"."role_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."role_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."site_metadata" (
    "id" bigint NOT NULL,
    "site_name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."site_metadata" OWNER TO "postgres";


ALTER TABLE "public"."site_metadata" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."site_metadata_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE SEQUENCE IF NOT EXISTS "public"."tags_id_sequence"
    START WITH 98
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
    CYCLE;


ALTER TABLE "public"."tags_id_sequence" OWNER TO "postgres";


ALTER SEQUENCE "public"."tags_id_sequence" OWNED BY "public"."categories"."id";



CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" bigint DEFAULT "nextval"('"public"."tags_id_sequence"'::"regclass") NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tag" "text" NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


ALTER TABLE "public"."emailUser" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tempUser_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_roles" IS 'Application roles for each user.';



ALTER TABLE "public"."user_roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_sequence"'::"regclass");



ALTER TABLE ONLY "public"."comments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."comments_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."games" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."games_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."likes_dislikes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."likes_dislikes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."providers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."providers_id_seq"'::"regclass");



ALTER TABLE ONLY "domain_access"."Domain"
    ADD CONSTRAINT "Domain_domain_key" UNIQUE ("domain");



ALTER TABLE ONLY "domain_access"."Domain"
    ADD CONSTRAINT "Domain_id_key" UNIQUE ("id");



ALTER TABLE ONLY "domain_access"."Domain"
    ADD CONSTRAINT "Domain_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ad_settings"
    ADD CONSTRAINT "ad_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_category_key" UNIQUE ("category");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contact_info"
    ADD CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."likes_dislikes"
    ADD CONSTRAINT "likes_dislikes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."likes_dislikes"
    ADD CONSTRAINT "likes_dislikes_user_id_game_id_key" UNIQUE ("user_id", "game_id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."providers"
    ADD CONSTRAINT "providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_permission_key" UNIQUE ("role", "permission");



ALTER TABLE ONLY "public"."site_metadata"
    ADD CONSTRAINT "site_metadata_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_metadata"
    ADD CONSTRAINT "site_metadata_site_name_key" UNIQUE ("site_name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_tag_key" UNIQUE ("tag");



ALTER TABLE ONLY "public"."emailUser"
    ADD CONSTRAINT "tempUser_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."emailUser"
    ADD CONSTRAINT "tempUser_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");



CREATE INDEX "idx_games_category" ON "public"."games" USING "gin" ("categories");



CREATE INDEX "idx_games_full_text" ON "public"."games" USING "gin" ("search_vector");



CREATE INDEX "idx_games_is_active" ON "public"."games" USING "btree" ("is_active");



CREATE UNIQUE INDEX "idx_games_play_url" ON "public"."games" USING "btree" ("play_url");



CREATE OR REPLACE TRIGGER "after_insert_update_games" AFTER INSERT OR UPDATE ON "public"."games" FOR EACH ROW EXECUTE FUNCTION "public"."insert_categories_and_tags"();



CREATE OR REPLACE TRIGGER "enforce_lowercase_categories_tags_trigger" BEFORE INSERT OR UPDATE ON "public"."games" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_lowercase_categories_tags"();



CREATE OR REPLACE TRIGGER "set_timestamps_games" BEFORE INSERT OR UPDATE ON "public"."games" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamps"();



CREATE OR REPLACE TRIGGER "set_timestamps_providers" BEFORE INSERT OR UPDATE ON "public"."providers" FOR EACH ROW EXECUTE FUNCTION "public"."set_timestamps"();



CREATE OR REPLACE TRIGGER "update_search_vector_trigger" BEFORE INSERT OR UPDATE ON "public"."games" FOR EACH ROW EXECUTE FUNCTION "public"."update_search_vector"();



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."likes_dislikes"
    ADD CONSTRAINT "likes_dislikes_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "domain_access"."Domain" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Allow admin users to do anything on ad settings" ON "public"."ad_settings" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on categories table" ON "public"."categories" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on contact info" ON "public"."contact_info" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on games" ON "public"."games" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on pages" ON "public"."pages" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on providers" ON "public"."providers" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on site metadata" ON "public"."site_metadata" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on tags table" ON "public"."tags" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow admin users to do anything on user permissions" ON "public"."role_permissions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'admin'::"public"."app_role")))));



CREATE POLICY "Allow anonymous users to view categories" ON "public"."categories" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow anonymous users to view games" ON "public"."games" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow anonymous users to view providers" ON "public"."providers" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow anonymous users to view tags" ON "public"."tags" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Allow authenticated users to delete their own records" ON "public"."emailUser" FOR DELETE TO "authenticated" USING (("email" = "auth"."email"()));



CREATE POLICY "Allow authenticated users to insert their own records" ON "public"."emailUser" FOR INSERT TO "authenticated" WITH CHECK (("email" = "auth"."email"()));



CREATE POLICY "Allow authenticated users to select their own records" ON "public"."emailUser" FOR SELECT TO "authenticated" USING (("email" = "auth"."email"()));



CREATE POLICY "Allow authenticated users to update their own records" ON "public"."emailUser" FOR UPDATE TO "authenticated" USING (("email" = "auth"."email"())) WITH CHECK (("email" = "auth"."email"()));



CREATE POLICY "Allow normal users to view categories" ON "public"."categories" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'user'::"public"."app_role")))));



CREATE POLICY "Allow normal users to view contact info" ON "public"."contact_info" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'user'::"public"."app_role")))));



CREATE POLICY "Allow normal users to view games" ON "public"."games" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'user'::"public"."app_role")))));



CREATE POLICY "Allow normal users to view pages" ON "public"."pages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'user'::"public"."app_role")))));



CREATE POLICY "Allow normal users to view providers" ON "public"."providers" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'user'::"public"."app_role")))));



CREATE POLICY "Allow normal users to view tags" ON "public"."tags" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_roles"
  WHERE (("user_roles"."user_id" = "auth"."uid"()) AND ("user_roles"."role" = 'user'::"public"."app_role")))));



CREATE POLICY "Allow public to read user roles" ON "public"."user_roles" FOR SELECT USING (true);



CREATE POLICY "Allow public users to read all records" ON "public"."emailUser" FOR SELECT USING (true);



CREATE POLICY "Allow public users to view categories" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Allow public users to view games" ON "public"."games" FOR SELECT USING (true);



CREATE POLICY "Allow public users to view providers" ON "public"."providers" FOR SELECT USING (true);



CREATE POLICY "Allow public users to view site metadata" ON "public"."site_metadata" FOR SELECT USING (true);



CREATE POLICY "Allow public users to view tags" ON "public"."tags" FOR SELECT USING (true);



ALTER TABLE "public"."ad_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."emailUser" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";




















































































































































































GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "service_role";



REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."enforce_lowercase_categories_tags"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_lowercase_categories_tags"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_lowercase_categories_tags"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_categories_and_tags"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_categories_and_tags"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_categories_and_tags"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_timestamps"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_timestamps"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_timestamps"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_timestamps_with_only_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_timestamps_with_only_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_timestamps_with_only_created"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_search_vector"() TO "service_role";


















GRANT ALL ON TABLE "public"."ad_settings" TO "anon";
GRANT ALL ON TABLE "public"."ad_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."ad_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ad_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ad_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ad_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_sequence" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_sequence" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_sequence" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contact_info" TO "anon";
GRANT ALL ON TABLE "public"."contact_info" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_info" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contact_info_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contact_info_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contact_info_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."emailUser" TO "anon";
GRANT ALL ON TABLE "public"."emailUser" TO "authenticated";
GRANT ALL ON TABLE "public"."emailUser" TO "service_role";



GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";



GRANT ALL ON SEQUENCE "public"."games_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."games_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."games_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."likes_dislikes" TO "anon";
GRANT ALL ON TABLE "public"."likes_dislikes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes_dislikes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."likes_dislikes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."likes_dislikes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."likes_dislikes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pages" TO "anon";
GRANT ALL ON TABLE "public"."pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."providers" TO "anon";
GRANT ALL ON TABLE "public"."providers" TO "authenticated";
GRANT ALL ON TABLE "public"."providers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."providers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."providers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."providers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."site_metadata" TO "anon";
GRANT ALL ON TABLE "public"."site_metadata" TO "authenticated";
GRANT ALL ON TABLE "public"."site_metadata" TO "service_role";



GRANT ALL ON SEQUENCE "public"."site_metadata_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."site_metadata_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."site_metadata_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tags_id_sequence" TO "anon";
GRANT ALL ON SEQUENCE "public"."tags_id_sequence" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tags_id_sequence" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tempUser_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tempUser_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tempUser_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "service_role";
GRANT ALL ON TABLE "public"."user_roles" TO "supabase_auth_admin";
GRANT SELECT ON TABLE "public"."user_roles" TO "authenticated";



GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
