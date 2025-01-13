const zod=require('zod')

const movieSchema = zod.object({
      title: zod.string(),
      year: zod.number().int().min(1800).max(new Date().getFullYear()),
      director: zod.string(),
      duration: zod.number().int().positive(),
      poster: zod.string().url({
        message: "Debe ser una url"
      }),
      genre: zod.array(
        zod.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy','Horror', 'Triller', 'Sci-Fi'])
      ),
      rate: zod.number().min(0).max(10).default(5),

    })

function validateMovie(objeto){
    const validated = movieSchema.safeParse(objeto)
    return validated
}

function validatePartialMovie(objeto){
    const validated = movieSchema.partial().safeParse(objeto)
    return validated
}


module.exports = {validateMovie, validatePartialMovie}