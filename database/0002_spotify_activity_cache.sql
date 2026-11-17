CREATE TABLE IF NOT EXISTS public.spotify_activity_cache (
  id smallint PRIMARY KEY CHECK (id = 1),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON public.spotify_activity_cache FROM PUBLIC;
