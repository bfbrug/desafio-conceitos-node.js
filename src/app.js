const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid repositorie ID.'});
  }

  return next();

}

app.get("/repositories", (request, response) => {
  //const { title, url, techs } = request.query;

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repositorie =  { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", validateRepositorieId, (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
    const { likes } = repositories.find(repositorie => repositorie.id === id);

     if(repositorieIndex < 0){
        return response.status(400).json({error: 'Repositorie not found.'});
    }

    const repositorie = {
        id,
        title,
        url,
        techs,
        likes : likes
    };

    repositories[repositorieIndex] = repositorie;
    
    return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

    if(repositorieIndex < 0){
        return response.status(400).json({error: 'Repositorie not found.'});
    }

    const repositorie = {
        id,
        title,
        url,
        techs
    };

    repositories[repositorieIndex] = repositorie;

    repositories.splice(repositorieIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositorieId, (request, response) => {
  const { id } = request.params;

  const { title, url, techs, likes } = repositories.find(repositorie => repositorie.id === id);
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400);
}
  
  const repositorie = {
    id,
    title,
    url,
    techs,
    likes : likes +1
};
  
  repositories[repositorieIndex] = repositorie

  return response.json(repositorie);


});

module.exports = app;
