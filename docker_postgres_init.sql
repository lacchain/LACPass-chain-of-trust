CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE laccpass_verification_registry_development
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE laccpass_verification_registry
WITH OWNER = docker
CONNECTION LIMIT = -1;

