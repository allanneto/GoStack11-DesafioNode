const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const verifyId = (request, response, next) => {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: 'O ID informado esta no formato errado.'})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  // TODO

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
  // TODO
});


app.put("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'ID informado não consta na base de dados!'});
  }

  const repository = {
    ...repositories[repositoryIndex],
    title: title ? title : repositories[repositoryIndex].title,
    url: url ? url : repositories[repositoryIndex].url,
    techs: techs? techs : repositories[repositoryIndex].techs,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
  // TODO
});

app.delete("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'ID informado não consta na base de dados!'});
  };


  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ message: "Repo deletado com sucesso!"})
  // TODO
});

app.post("/repositories/:id/like", verifyId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'ID informado não consta na base de dados!'});
  };

  const repository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1
  }

  repositories[repositoryIndex] = repository;

  return response.json({likes: repository.likes});
  // TODO
});

module.exports = app;
