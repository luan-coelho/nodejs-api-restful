const express = require('express');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

function logRoutes(req, res, next) {
  const { method, url } = req;

  const route = `[${method.toUpperCase()}] ${url}`;

  console.log(route);

  return next();
}

app.use(logRoutes);

app.get('/projects', (req, res) => {
  const { title } = req.query;

  const result = title ? projects.filter(project => project.title.includes(title)) : projects;

  return res.json(result);
})

app.get('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return res.json(projects[projectIndex]);
})

app.post('/projects', (req, res) => {
  const { title, owner } = req.body;

  const id = uuid();

  const project = {
    id,
    title,
    owner
  };

  projects.push(project);

  return res.json(project);

})

app.put('/projects/:id', (req, res) => {
  const { id } = req.params;

  const { title, owner } = req.body;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Project not found' });
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return res.json(project);

})

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.splice(projectIndex, 1);

  return res.status(204).json([]);
});

app.listen(3333, () => {
  console.log('Server running on http://localhost:3333');
})