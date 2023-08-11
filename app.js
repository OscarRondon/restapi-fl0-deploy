const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./Schemas/movie')

const port = process.env.PORT ?? 22522

const app = express()
app.use(express.json())

app.disable('x-powered-by')

const ACCEPTED_ORIGINS = [
  'http://localhost:22522',
  'http://localhost:8080',
  'http://localhost:3000'
]

// ---------------------- GETs -----------------------------------------------------

app.get('/', (req, res) => {
  const origin = req.header('origin')
  if (!ACCEPTED_ORIGINS.includes(origin) && origin) return res.status(403).json({ message: 'Origin not allowed' })

  res.send('Hello World')
})

app.get('/movies', (req, res) => {

  res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter(m => m.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(movies)

})

app.get('/movies/:id', (req, res) => { // path-to-regex

  const { id } = req.params
  const movie = movies.find(m => m.id === id)
  if (!movie) return res.status(404).json({ message: 'Movie not found' })
  res.json(movie)
})

// ---------------------- GETs -----------------------------------------------------
app.post('/movies', (req, res) => {

  const valResult = validateMovie(req.body)

  if (valResult.error) return res.status(400).json({ error: JSON.parse(valResult.error.message) })

  // const { error }

  // Antes de validaciones

  // const {
  //   title,
  //   year,
  //   director,
  //   duration,
  //   poster,
  //   genre,
  //   rate
  // } = req.body

  // const newMovie = {
  //   id: crypto.randomUUID(), // UUID v4
  //   title,
  //   year,
  //   director,
  //   duration,
  //   poster,
  //   genre,
  //   rate: rate ?? 0
  // }

  // Affter data validations
  const newMovie = {
    id: crypto.randomUUID(),
    ...valResult.data // UUID v4
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)

})

// ---------------------- PUT / PATCH / DELETE -----------------------------------------------------

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (!ACCEPTED_ORIGINS.includes(origin) && origin) return res.status(403).json({ message: 'Origin not allowed' })

  res.send()
})

app.patch('/movies/:id', (req, res) => { // path-to-regex

  const origin = req.header('origin')
  if (!ACCEPTED_ORIGINS.includes(origin) && origin) return res.status(403).json({ message: 'Origin not allowed' })
  res.header('Access-Control-Allow-Origin', 'GET, POST, PUT, PATCH, DELETE')
  const valResult = validatePartialMovie(req.body)

  if (valResult.error) return res.status(400).json({ error: JSON.parse(valResult.error.message) })

  const { id } = req.params
  const movieIndex = movies.findIndex(m => m.id === id)
  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  const updateMovie = {
    ...movies[movieIndex],
    ...valResult.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)

})

// ---------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
