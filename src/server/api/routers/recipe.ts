import { RecipeStatus } from '@prisma/client'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc'

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recipe.create({
        data: {
          name: input.name,
          status: RecipeStatus.DRAFT,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })

      return
    }),

  getMyDrafts: protectedProcedure.query(async ({ ctx }) => {
    const recipe = await ctx.db.recipe.findMany({
      where: {
        createdById: ctx.session.user.id,
        status: RecipeStatus.DRAFT,
      },
      include: {
        createdBy: true,
      },
    })

    return recipe
  }),

  delete: protectedProcedure
    .input(z.object({ recipeNameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recipe.delete({
        where: {
          id: input.recipeNameId,
        },
      })

      return
    }),

  getMyPublisheds: protectedProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.db.recipe.findMany({
      where: {
        createdById: ctx.session.user.id,
        status: RecipeStatus.PUBLISHED,
      },
      include: {
        createdBy: true,
      },
    })

    return recipes
  }),

  getById: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipeName = await ctx.db.recipe.findUnique({
        where: {
          id: input.recipeId,
        },
        include: {
          createdBy: true,
        },
      })

      return recipeName
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().min(1),
        method: z.string().min(1),
        time: z.string().min(1),
        difficulty: z.string().min(1),
        servings: z.string().min(1),
        ingredients: z.record(
          z.string(),
          z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              amount: z.string(),
            }),
          ),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
          method: input.method,
          time: input.time,
          difficulty: input.difficulty,
          servings: input.servings,
          ingredients: input.ingredients,
        },
      })

      return
    }),
})
