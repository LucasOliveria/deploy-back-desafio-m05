create database pay_status;
create table users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password text not null,
  cpf char(11) unique,
  phone char(11) unique
);
create table clients  (
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
  uf char(2)
);
CREATE TABLE charges (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL,
  description TEXT NOT NULL,
  value NUMERIC(15) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(10) CHECK (status IN ('pago', 'pendente')) NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
