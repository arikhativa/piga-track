create extension if not exists pg_net with schema "extensions";
create extension if not exists pg_cron with schema "extensions";

-- Configure scrape_function_url and scrape_api_key in Vault before enabling runs.
-- The hourly UTC schedule checks Jerusalem time to preserve 06:00 across DST.
-- NOTE: u must create the `scrape_api_key` in the vault
select cron.schedule(
  'scrape-transactions-daily',
  '0 * * * *',
  $$
  select net.http_post(
    url := (
      select decrypted_secret
      from vault.decrypted_secrets
      where name = 'scrape_function_url'
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'scrape_api_key'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  )
  where extract(
    hour from now() at time zone 'Asia/Jerusalem'
  ) = 6;
  $$
);
