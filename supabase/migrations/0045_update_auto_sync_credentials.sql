-- Called only by the authenticated Edge Function using its backend secret key.
CREATE FUNCTION public.update_auto_sync_credentials(p_credentials jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
    v_source public.auto_sync_conf%ROWTYPE;
    v_credentials jsonb := '{}'::jsonb;
    v_secret_text text;
    v_secret_id uuid;
    v_password text;
BEGIN
    IF p_credentials IS NULL
        OR pg_catalog.jsonb_typeof(p_credentials) IS DISTINCT FROM 'object'
    THEN
        RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Invalid request';
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_catalog.jsonb_object_keys(p_credentials) AS fields(key)
        WHERE fields.key <> 'password'
    ) OR (p_credentials ? 'password'
        AND pg_catalog.jsonb_typeof(p_credentials -> 'password') IS DISTINCT FROM 'string')
    THEN
        RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Invalid credentials';
    END IF;

    -- Serialize updates for this source, including first-time secret creation.
    SELECT source.* INTO STRICT v_source
    FROM public.auto_sync_conf AS source
    WHERE pg_catalog.lower(source.src_name) = 'max'
    FOR UPDATE;

    v_secret_id := v_source.credentials_secret_id;
    IF v_secret_id IS NOT NULL THEN
        SELECT secret.decrypted_secret INTO v_secret_text
        FROM vault.decrypted_secrets AS secret
        WHERE secret.id = v_secret_id;

        IF NOT FOUND OR v_secret_text IS NULL THEN
            RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Credentials unavailable';
        END IF;
        BEGIN
            v_credentials := v_secret_text::jsonb;
        EXCEPTION WHEN invalid_text_representation THEN
            RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Credentials unavailable';
        END;
        IF pg_catalog.jsonb_typeof(v_credentials) IS DISTINCT FROM 'object' THEN
            RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'Credentials unavailable';
        END IF;
    END IF;

    v_password := p_credentials ->> 'password';
    -- Blank inputs retain the stored password; nonblank passwords remain untrimmed.
    IF v_password IS NOT NULL AND v_password !~ '^[[:space:]]*$' THEN
        v_credentials := v_credentials || pg_catalog.jsonb_build_object('password', v_password);
    END IF;

    IF pg_catalog.jsonb_typeof(v_credentials -> 'password') IS DISTINCT FROM 'string'
        OR (v_credentials ->> 'password') ~ '^[[:space:]]*$'
    THEN
        RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Password required';
    END IF;

    IF v_secret_id IS NULL THEN
        v_secret_id := vault.create_secret(v_credentials::text);
        UPDATE public.auto_sync_conf
        SET credentials_secret_id = v_secret_id
        WHERE id = v_source.id;
    ELSE
        PERFORM vault.update_secret(v_secret_id, v_credentials::text);
    END IF;

    RETURN pg_catalog.jsonb_build_object('success', true);
END;
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION public.update_auto_sync_credentials(jsonb)
FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.update_auto_sync_credentials(jsonb)
TO service_role;
