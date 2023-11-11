import sql from "./db.js";
import { randomUUID } from "crypto";

export class DatabasePostgres {
  #videos = new Map();

  async list(search) {
    let videos;

    if (search) {
      videos = await sql`select * from videos where title ilike ${
        "%" + search + "%"
      }`;
    } else {
      videos = await sql`select * from videos`;
    }

    return videos;
  }

  async create(video) {
    const videoId = randomUUID();
    const videoData = {
      id: videoId,
      title: video.title,
      description: video.description,
      duration: video.duration,
    };
    console.log(videoData);
    await sql`
            insert into videos ${sql(
              videoData,
              "id",
              "title",
              "description",
              "duration"
            )}
        `;
  }

  async update(id, video) {
    const { title, description, duration } = video;

    await sql` update videos set title = ${title}, description = ${description}, duration = ${duration}
    where id = ${id}

    `;
  }

  async delete(id) {
    await sql`delete from videos where  id = ${id}`;
  }
}
