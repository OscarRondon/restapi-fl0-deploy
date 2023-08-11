const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string'
  }),
  year: z.number().int().min(1900).max(2100),
  director: z.string(),
  duration: z.number().positive(),
  poster: z.string().url(),
  genre: z.array(z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Horror', 'Romance', 'Sci-Fi'])),
  rate: z.number().min(0).max(10).default(0)
})

function validateMovie (movie) {
  return movieSchema.safeParse(movie)
}

function validatePartialMovie (movie) {
  return movieSchema.partial().safeParse(movie)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
