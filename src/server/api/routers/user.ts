import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the user already exists with email or name
      const existingUser = await ctx.db.user.findFirst({
        where: {
          OR: [{ email: input.email }, { name: input.name }],
        },
      })
      if (existingUser) {
        throw new Error('User already exists')
      }

      await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      })

      return
    }),
})
