CREATE TABLE IF NOT EXISTS public.spotify_owner_tokens (
  id smallint PRIMARY KEY CHECK (id = 1),
  encrypted_tokens text NOT NULL,
  expires_at timestamptz NOT NULL,
  public_consent_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.spotify_owner_tokens
  ADD COLUMN IF NOT EXISTS public_consent_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.spotify_dashboard_cache (
  time_range text PRIMARY KEY CHECK (time_range IN ('short_term', 'medium_term', 'long_term')),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON public.spotify_owner_tokens FROM PUBLIC;
REVOKE ALL ON public.spotify_dashboard_cache FROM PUBLIC;
