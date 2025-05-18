/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { RecipeStatus } from '@prisma/client'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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

  getById: publicProcedure
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
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
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
          difficultyId: input.difficultyId || undefined,
        },
      })

      return
    }),

  getDifficulties: protectedProcedure.query(async ({ ctx }) => {
    const difficulties = await ctx.db.recipeDifficulty.findMany({
      // Get difficulties those created by me or null
      where: {
        OR: [
          {
            createdById: ctx.session.user.id,
          },
          {
            createdById: null,
          },
        ],
      },
      orderBy: {
        index: 'asc',
      },
    })

    return difficulties
  }),

  createDifficulty: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingDifficulty =
        await ctx.db.recipeDifficulty.findFirst({
          where: {
            name: input.name,
          },
        })
      if (existingDifficulty) {
        throw new Error('Difficulty already exists')
      }
      const maxIndex = await ctx.db.recipeDifficulty.aggregate({
        where: {
          OR: [
            {
              createdById: ctx.session.user.id,
            },
            {
              createdById: null,
            },
          ],
        },
        _max: {
          index: true,
        },
      })

      return await ctx.db.recipeDifficulty.create({
        data: {
          name: input.name,
          index: (maxIndex._max.index || 0) + 1,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
    }),

  isLiked: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const isLiked = await ctx.db.like.findFirst({
        where: {
          recipeId: input.recipeId,
          userId: ctx.session.user.id,
        },
      })
      return !!isLiked
    }),

  like: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isLiked = await ctx.db.like.findFirst({
        where: {
          recipeId: input.recipeId,
          userId: ctx.session.user.id,
        },
      })

      if (isLiked) {
        await ctx.db.like.delete({
          where: {
            id: isLiked.id,
          },
        })
      } else {
        await ctx.db.like.create({
          data: {
            recipeId: input.recipeId,
            userId: ctx.session.user.id,
          },
        })
      }
    }),
})
