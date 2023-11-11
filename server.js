import { fastify } from "fastify";
import { DatabasePostgres } from "./db-postgres.js";
import "dotenv/config";

const server = fastify();

const db = new DatabasePostgres();

server.post("/videos", async (request, response) => {
  try {
    const { title, description, duration } = request.body;

    await db.create({
      title: title,
      description: description,
      duration: duration,
    });

    return response.status(201).send();
  } catch (error) {
    console.log(new Error(error.message));
    return {
      error: error.message,
      message: "Abort execution: Post not created!",
    };
  }
});

server.get("/videos", async (request) => {
  const search = request.query.search;
  const videos = await db.list(search);
  return videos;
});

server.put("/videos/:id", async (request, response) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;

  await db.update(videoId, {
    title,
    description,
    duration,
  });

  return response.status(204).send();
});

server.delete("/videos/:id", async (request, response) => {
  const videoId = request.params.id;

  await db.delete(videoId);

  return response.status(204).send();
});

server.listen({
  port: process.env.PORT ?? 3333,
  host: "0.0.0.0",
});
