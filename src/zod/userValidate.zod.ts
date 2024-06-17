import * as zod from 'zod'

export const registerDataValidation = zod.object({
    username : zod.string(),
    email : zod.string().email(),
    password : zod.string().min(8)
})

export const loginDataValidation = zod.object({
    email : zod.string().email(),
    password : zod.string().min(8)
})
