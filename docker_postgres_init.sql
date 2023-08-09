CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE lacpass_chain_of_trust_development
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE lacpass_chain_of_trust
WITH OWNER = docker
CONNECTION LIMIT = -1;

