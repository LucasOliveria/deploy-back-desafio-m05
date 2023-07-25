create database pay_status;
create table users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null,
  cpf char(11) unique,
  phone char(11) unique
);
create table client(
  id serial primary key,
  name text not null,
  email text not null unique,
  cpf char(11) not null unique,
  phone char(11) not null,
  zip_code text,
  public_place text,
  complement text,
  district text,
  city text,
  uf char(2),
  up_to_date boolean default true
);