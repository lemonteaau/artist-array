-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.comments (
  content text NOT NULL,
  user_id uuid NOT NULL,
  prompt_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.prompts(id),
  CONSTRAINT comments_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.likes (
  user_id uuid NOT NULL,
  prompt_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT likes_pkey PRIMARY KEY (user_id, prompt_id),
  CONSTRAINT likes_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.prompts(id),
  CONSTRAINT likes_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT now(),
  display_name text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.prompts (
  artist_string text NOT NULL,
  image_url text NOT NULL,
  prompt text,
  negative_prompt text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  model USER-DEFINED,
  CONSTRAINT prompts_pkey PRIMARY KEY (id),
  CONSTRAINT prompts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);