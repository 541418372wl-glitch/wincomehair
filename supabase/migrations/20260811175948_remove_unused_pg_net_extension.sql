-- pg_net is not used by the application and has no dependent objects.
-- Do not use CASCADE: an unexpected dependency must make this migration fail.
drop extension if exists pg_net;
