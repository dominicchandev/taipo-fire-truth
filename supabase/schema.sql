-- Create events table
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date timestamp with time zone not null,
  status text check (status in ('pending', 'verified', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create evidence table
create table evidence (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade not null,
  title text not null,
  description text,
  type text check (type in ('youtube', 'iframe', 'link', 'blob')) not null,
  content_url text not null,
  side text check (side in ('pro', 'against', 'neutral')) default 'neutral',
  status text check (status in ('pending', 'verified', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table events enable row level security;
alter table evidence enable row level security;

-- Create policies
-- Allow public read access to verified events and evidence
create policy "Public events are viewable by everyone"
  on events for select
  using (status = 'verified');

create policy "Public evidence are viewable by everyone"
  on evidence for select
  using (status = 'verified');

-- Allow public to insert pending events (submission)
create policy "Public can insert pending events"
  on events for insert
  with check (status = 'pending');

create policy "Public can insert pending evidence"
  on evidence for insert
  with check (status = 'pending');

-- Allow authenticated users (admins) to do everything
create policy "Admins can do everything on events"
  on events for all
  using (auth.role() = 'authenticated');

create policy "Admins can do everything on evidence"
  on evidence for all
  using (auth.role() = 'authenticated');

-- Seed initial data (from current data.ts)
-- Note: You might need to adjust the dates or IDs after running this.

INSERT INTO events (id, title, date, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '協助宏福苑居民填寫大維修相關資助表格', '2024-07-31 11:58:00+08', 'verified'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '東張西望', '2024-07-01 00:00:00+08', 'verified'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '黃碧嬌反對罷免', '2024-08-24 10:45:00+08', 'verified'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '宏福苑大維修期間發生火災', '2025-11-26 00:00:00+08', 'verified');

INSERT INTO evidence (event_id, title, type, content_url, side, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Facebook Post', 'iframe', '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fwongpeggytaipo%2Fposts%2Fpfbid0FSLBXAfJn2hXSuVt4JsErytGXfyafNXDJhNGj6nAFYJTeAmaiX3YEMitJQqZaCxQl&show_text=true&width=500" width="500" height="709" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>', 'neutral', 'verified'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Youtube Video', 'link', 'https://www.youtube.com/watch?v=0eOcOGI6R88', 'neutral', 'verified'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Facebook Post', 'iframe', '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fwongpeggytaipo%2Fposts%2Fpfbid02WAgTjR43ygZjeyrhHGJuLpi653nF6ryzG7kjw8rNF7yqC3XjrCrsBPGufG6jU15fl&show_text=true&width=500" width="500" height="581" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>', 'neutral', 'verified'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Youtube Video', 'link', 'https://www.youtube.com/watch?v=0eOcOGI6R88', 'neutral', 'verified');

-- Storage Setup
-- Create a public bucket for evidence files
insert into storage.buckets (id, name, public) 
values ('evidence-files', 'evidence-files', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access" 
  on storage.objects for select 
  using ( bucket_id = 'evidence-files' );

create policy "Public Upload" 
  on storage.objects for insert 
  with check ( bucket_id = 'evidence-files' );
