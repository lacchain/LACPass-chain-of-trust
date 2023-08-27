CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE lacchain_trust_development
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE lacchain_trust
WITH OWNER = docker
CONNECTION LIMIT = -1;

