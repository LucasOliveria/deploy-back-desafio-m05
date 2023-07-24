create database pay_status;

create table users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null,
  cpf char(11) unique,
  phone char(11)
);