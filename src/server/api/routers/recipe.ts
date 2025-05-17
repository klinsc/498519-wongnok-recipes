import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc'

export const recipeRouter = createTRPCRouter({
  createName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recipeName.create({
        data: {
          name: input.name,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })

      return
    }),

  createDetail: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        description: z.string().min(1),
        method: z.string().min(1),
        time: z.string().min(1),
        difficulty: z.string().min(1),
        servings: z.string().min(1),
        ingredients: z.array(
          z.object({
            name: z.string().min(1),
            amount: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recipeDetail.create({
        data: {
          recipeName: {
            connect: {
              id: input.recipeId,
            },
          },
          description: input.description,
          method: input.method,
          time: input.time,
          difficulty: input.difficulty,
          servings: input.servings,
          date: new Date(), // or provide the appropriate date value
          image: '', // or provide the appropriate image URL or path
          ingredients: {
            create: input.ingredients.map((ingredient) => ({
              name: ingredient.name,
              amount: ingredient.amount,
            })),
          },
        },
      })

      return
    }),

  getRecipeByUserId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipeName.findMany({
        where: {
          createdById: input.id,
        },
        include: {
          createdBy: true,
        },
      })

      return recipe
    }),
})
