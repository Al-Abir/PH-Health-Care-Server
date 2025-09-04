import {z} from 'zod'

const update = z.object({
    body:z.object({
        name:z.string().optional(),
        contact_number:z.string().optional()
    }).strict()
})

export default update;