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
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recipe.delete({
        where: {
          id: input.recipeId,
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
          difficulty: true,
        },
      })

      return recipeName
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        method: z.string().optional(),
        time: z.string().optional(),
        difficultyId: z.string().optional(),
        servings: z.string().optional(),
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
          ...input,
        },
      })

      return
    }),
})
