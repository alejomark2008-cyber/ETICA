-- Ejecuta este SQL en Supabase > SQL Editor.
-- Sirve tanto para crear la tabla como para adaptar una tabla ya creada.

create table if not exists public.encuestas (
  id bigint generated always as identity primary key,
  respuesta text not null,
  creado_en timestamptz not null default now()
);

alter table public.encuestas
  drop constraint if exists respuesta_valida;

alter table public.encuestas
  add constraint respuesta_valida check (respuesta in (
    'Sí, la mayoría se respeta.',
    'A veces, hay situaciones de falta de respeto.',
    'No, hay muchos conflictos.',
    'No estoy seguro/a.'
  ));

alter table public.encuestas enable row level security;
revoke all on public.encuestas from anon;
grant insert on public.encuestas to anon;

drop policy if exists "Permitir enviar respuestas" on public.encuestas;
create policy "Permitir enviar respuestas"
on public.encuestas
for insert
to anon
with check (respuesta in (
  'Sí, la mayoría se respeta.',
  'A veces, hay situaciones de falta de respeto.',
  'No, hay muchos conflictos.',
  'No estoy seguro/a.'
));
