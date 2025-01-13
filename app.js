const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')

const zod=require('zod')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')


const app = express()
app.disable("x-powered-by")
app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://example.com',
]


app.get('/', (req, res) => {
  res.json({message: "Hola Mundo!"})
  })

  app.get('/movies', (req, res) => {
   // const origin = req.header.origin
    //no la envía cuando la petición es del mismo origin 
    /*if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      res.header('Access-Control-Allow-Origin', origin)
    }*/    
    const {genre} = req.query
    if(genre){
      const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase()))
      return res.json(filteredMovies)
    }
    res.json(movies)
  })

  app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id
    const movie = movies.find(m => m.id === movieId)
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }
    res.json(movie)
  })

  app.post('/movies', (req, res) => {
    
    const resultado = validateMovie(req.body)
    if (resultado.error) {
      return res.status(422).json(
        {error: JSON.parse(resultado.error.message)})
    }

    const newMovie = {
      id: crypto.randomUUID(),
      ...resultado.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)

   })

   app.patch('/movies/:id', (req, res) => {    
      resultado = validatePartialMovie(req.body)
      if (resultado.error) {
        return res.status(422).json(
          {error: JSON.parse(resultado.error.message)})
      }

      const movieId = req.params.id
      const movieIndex = movies.findIndex(m => m.id === movieId)
      if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" })
      }

      const movieUpdate = {
        ...movies[movieIndex],
        ...resultado.data
      }
    
      movies[movieIndex] = movieUpdate
      return res.json(movieUpdate)
   })

   pp.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })

  const port = process.env.PORT ?? 1234

  app.listen(port, () => {
    console.log(`Server is running on port por http://localhost:${port}`)
  })
