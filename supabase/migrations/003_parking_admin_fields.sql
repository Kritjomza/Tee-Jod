alter table public.parking_lots add column if not exists reserved_spaces integer not null default 0 check (reserved_spaces >= 0);
alter table public.parking_lots add column if not exists accessible_spaces integer not null default 0 check (accessible_spaces >= 0);
alter table public.parking_lots add column if not exists ev_charger_spaces integer not null default 0 check (ev_charger_spaces >= 0);
alter table public.parking_lots add column if not exists warning text;
alter table public.parking_lots add constraint parking_lots_reserved_le_available check (reserved_spaces <= available_spaces);
