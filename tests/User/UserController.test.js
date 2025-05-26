import supertest from "supertest";
import { app, server } from "../../src/app.js";
import mongoose from "mongoose";

const api = supertest(app)


test('Devuelve un json con los usuarios y la información de paginación', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close();
  server.close(); // Asegúrate de cerrar el servidor.
})
