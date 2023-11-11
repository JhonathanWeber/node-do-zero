import { fastify } from "fastify";
import { DatabasePostgres } from "./db-postgres.js";
import fs from "fs";

import "dotenv/config";

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

const server = fastify({
  http2: true,
  https: options,
});

// console.log(process.env);

const db = new DatabasePostgres();

server.get("/", (req, res) => {
  res.code(200).send({ hello: "world" });
});

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
    return {
      error: error.message,
      message:
        "Abort execution: Post not created,  please try again, if error persists contact administrator of this service",
    };
  }
});

server.get("/videos", async (request) => {
  try {
    const search = request.query.search;
    const videos = await db.list(search);
    return videos;
  } catch (error) {
    return {
      error: error.message,
      message:
        "Abort execution of search query,  please try again, if error persists contact administrator of this service",
    };
  }
});

server.put("/videos/:id", async (request, response) => {
  try {
    const videoId = request.params.id;
    const { title, description, duration } = request.body;

    await db.update(videoId, {
      title,
      description,
      duration,
    });

    return response.status(204).send();
  } catch (error) {
    return {
      error: error.message,
      message:
        "Aborted video update, please try again, if error persists contact administrator of this service.",
    };
  }
});

server.delete("/videos/:id", async (request, response) => {
  try {
    const videoId = request.params.id;

    await db.delete(videoId);

    return response.status(204).send();
  } catch (error) {
    return {
      error: error.message,
      message:
        "Aborted video delete, please try again, if error persists contact administrator of this service.",
    };
  }
});

server.listen({
  // eslint-disable-next-line no-undef
  port: process.env.PORT ?? 3333,
  host: "0.0.0.0",
});

// // server.use((req, res, next) => {
// //   if (req.protocol === "http") {
// //     res.redirect(301, `https://${req.hostname}${req.url}`);
// //   } else {
// //     next();
// //   }
// });
