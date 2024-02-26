import express, { Request, Response } from "express";
import { connect } from "./database";
import { Actor } from "./models/actor";
import { Film } from "./models/film";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.json());
(async () => {
  await connect();

  app.get("/api/actors", async (req: any, res: any) => {
    const { name } = req.body;
    const actor: any = await Actor.findAll();
    const response = actor.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
      };
    });
    res.status(200).json(response);
  });

  app.delete("/api/actor/:id", async (req: any, res: any) => {
    const { id } = req.params;
    await Actor.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({});
  });

  app.get("/api/actor/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const actor: any = await Actor.findOne({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      id: actor.id,
      name: actor.name,
    });
  });

  app.patch("/api/actor/:id", async (req: any, res: any) => {
    const { name } = req.body;
    const { id } = req.params;
    await Actor.update(
      { name },
      {
        where: {
          id: id,
        },
      }
    );
    const actor: any = await Actor.findOne({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      id: actor.id,
      name: actor.name,
    });
  });

  app.post("/api/actor", async (req: any, res: any) => {
    const { name } = req.body;
    const actor: any = await Actor.create({ name });
    res.status(201).json({
      id: actor.id,
      name: actor.name,
    });
  });

  app.get("/api/films", async (req: any, res: any) => {
    const films: any = await Film.findAll({ include: Actor });
    res.status(200).json(
      films.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          actors: item.actors.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
            };
          }),
        };
      })
    );
  });

  app.get("/api/film/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const film: any = await Film.findOne({
      where: { id: id },
      include: Actor,
    });
    res.status(200).json({
      id: film.id,
      name: film.name,
      actors: film.actors.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
        };
      }),
    });
  });

  app.patch("/api/film/:id", async (req: any, res: any) => {
    const { name, actors } = req.body;
    const { id } = req.params;
    await Film.update(
      { name: name },
      {
        where: {
          id: id,
        },
      }
    );

    const film: any = await Film.findOne({
      where: { id: id },
      include: Actor,
    });
    if (actors && actors.length > 0) {
      const actorsToAdd = await Actor.findAll({ where: { id: actors } });
      await film.setActors(actorsToAdd);
    }
    const actorsData = await film.getActors();

    res.status(201).json({
      id: film.id,
      name: film.name,
      actors: actorsData.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
        };
      }),
    });
  });

  app.post("/api/film", async (req: any, res: any) => {
    const { name, actors } = req.body;
    const film: any = await Film.create({ name });

    if (actors && actors.length > 0) {
      const actorsToAdd = await Actor.findAll({ where: { id: actors } });
      await film.setActors(actorsToAdd);
    }
    const actorsData = await film.getActors();

    res.status(201).json({
      id: film.id,
      name: film.name,
      actors: actorsData.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
        };
      }),
    });
  });

  app.delete("/api/film/:id", async (req: any, res: any) => {
    const { id } = req.params;
    await Film.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({});
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
})();
