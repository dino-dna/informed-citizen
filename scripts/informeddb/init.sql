create user cronkite with encrypted password 'SmJoZPTlzHDYcXPJyeyFxkwwgSjxxyEyXjJDkBJsMUxZNBtfj';
grant all privileges on database informed to cronkite;

create table analyses (
  id serial primary key,
  url varchar,
  result jsonb
);

insert into analyses (url, result) values
  ('htts://bad.org', '{"thing": 1, "thang": "zone"}'),
  ('htts://evil.net', '{"bad stuff": 1, "thang": "zone"}');;
