-- E-KANJOLI 0006
-- Grant read privileges required by documents RLS policies.

grant select on public.document_routings to authenticated;
grant select on public.dispositions to authenticated;

commit;
