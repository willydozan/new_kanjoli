-- E-KANJOLI 0005
-- Grant read access for authenticated users to Surat Masuk data.

grant select on public.documents to authenticated;
grant select on public.document_classifications to authenticated;
grant select on public.service_domains to authenticated;
grant select on public.service_types to authenticated;

commit;
