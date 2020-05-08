const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const titleNotExists = !title;
  const urlNotExists = !url;
  const techsNotExists = !techs;

  if (titleNotExists || urlNotExists || techsNotExists) {
    response.status(400).json({ error: "Validation fails" });
  }
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);
  
  return response.status(200).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const selectedRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (selectedRepositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not exits" });
  }

  const newRepository = {
    id,
    title, 
    url, 
    techs,
    likes: repositories[selectedRepositoryIndex].likes
  }
  repositories[selectedRepositoryIndex] = newRepository;
  
  return response.status(200).json({ ...newRepository });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const selectedRepositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (selectedRepositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not exits" });
  }

  repositories.splice(selectedRepositoryIndex, 1);
  
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const selectedRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (selectedRepositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not exits" });
  }

  repositories[selectedRepositoryIndex].likes++;

  return response.status(200).json({ likes: repositories[selectedRepositoryIndex].likes });

});

module.exports = app;
