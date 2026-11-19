import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { createApp } from "../app.js";
import { User } from "../models/User.model.js";

let mongo;
let app;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  app = createApp({
    jwtSecret: "test-secret-with-more-than-thirty-two-characters",
  });
});

beforeEach(async () => {
  await User.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("registers users with a password hash and rejects duplicate email addresses", async () => {
  const registration = await request(app).post("/api/auth/register").send({
    name: "Alex Morgan",
    email: "Alex@example.com",
    password: "correct-horse-42",
  });

  assert.equal(registration.status, 201);
  assert.equal(registration.body.user.email, "alex@example.com");
  assert.equal("password" in registration.body.user, false);
  assert.equal("password_hash" in registration.body.user, false);
  assert.ok(registration.body.accessToken);
  assert.match(registration.headers["set-cookie"][0], /HttpOnly/i);

  const storedUser = await User.findOne({ email: "alex@example.com" }).select("+passwordHash");
  assert.match(storedUser.passwordHash, /^\$2[aby]\$/);

  const duplicate = await request(app).post("/api/auth/register").send({
    name: "Another Alex",
    email: "ALEX@example.com",
    password: "another-password-1",
  });
  assert.equal(duplicate.status, 409);
});

test("validates registration and rejects incorrect login credentials", async () => {
  const invalid = await request(app).post("/api/auth/register").send({
    name: "A",
    email: "not-an-email",
    password: "short",
  });
  assert.equal(invalid.status, 400);
  assert.ok(invalid.body.errors.email);
  assert.ok(invalid.body.errors.password);

  await request(app).post("/api/auth/register").send({
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "correct-horse-42",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "alex@example.com",
    password: "incorrect-password",
  });
  assert.equal(login.status, 401);

  const validLogin = await request(app).post("/api/auth/login").send({
    email: "alex@example.com",
    password: "correct-horse-42",
  });
  assert.equal(validLogin.status, 200);
  assert.ok(validLogin.body.accessToken);
});

test("persists an authenticated session and clears it on logout", async () => {
  const agent = request.agent(app);
  await agent.post("/api/auth/register").send({
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "correct-horse-42",
  });

  const session = await agent.get("/api/auth/me");
  assert.equal(session.status, 200);
  assert.equal(session.body.user.name, "Alex Morgan");
  assert.ok(session.body.accessToken);

  const logout = await agent.post("/api/auth/logout");
  assert.equal(logout.status, 200);

  const afterLogout = await agent.get("/api/auth/me");
  assert.equal(afterLogout.status, 401);
});
