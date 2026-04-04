-- Create the jeopardy-images storage bucket (public)
insert into storage.buckets (id, name, public)
values ('jeopardy-images', 'jeopardy-images', true)
on conflict (id) do nothing;

-- Allow anyone to read (view) images
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'jeopardy-images');

-- Allow anyone to upload images
create policy "Public upload access"
  on storage.objects for insert
  with check (bucket_id = 'jeopardy-images');

-- Allow anyone to delete images
create policy "Public delete access"
  on storage.objects for delete
  using (bucket_id = 'jeopardy-images');
