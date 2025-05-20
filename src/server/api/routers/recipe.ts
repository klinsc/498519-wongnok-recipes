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

  getPublisedByUserId: publicProcedure
    .input(z.object({ userID: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipes = await ctx.db.recipe.findMany({
        where: {
          createdById: input.userID,
          status: RecipeStatus.PUBLISHED,
        },
        include: {
          createdBy: true,
          difficulty: true,
        },
      })
      return recipes
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

  getAllPublisheds: publicProcedure
    .input(z.object({ page: z.number(), limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const recipes = await ctx.db.recipe.findMany({
        where: {
          status: RecipeStatus.PUBLISHED,
        },
        include: {
          createdBy: true,
          difficulty: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        // page start from 0
        skip: input.page * input.limit,
        take: input.limit,
      })

      const total = await ctx.db.recipe.count({
        where: {
          status: RecipeStatus.PUBLISHED,
        },
      })

      return { recipes, total, page: input.page, limit: input.limit }
    }),

  getById: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      // If this recipe is owned by the user, return all data, if not, return only status of PUBLISHED
      const recipe = await ctx.db.recipe.findUnique({
        where: {
          id: input.recipeId,
        },
        include: {
          createdBy: true,
          difficulty: true,
        },
      })
      if (!recipe) {
        throw new Error('Recipe not found')
      }

      if (recipe.createdById === ctx.session?.user.id) {
        return recipe
      }

      if (recipe.status === RecipeStatus.PUBLISHED) {
        return recipe
      }

      throw new Error('Unauthorized')
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

  likeStatus: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if the user liked the recipe
      const isLiked = await ctx.db.like.findFirst({
        where: {
          recipeId: input.recipeId,
          userId: ctx.session.user.id,
        },
      })

      // Check how many likes the recipe has by counting the likes
      const likeCount = await ctx.db.like.count({
        where: {
          recipeId: input.recipeId,
        },
      })
      return {
        isLiked: !!isLiked,
        likeCount,
      }
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

  publish: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const completedRecipe = await ctx.db.recipe.findUnique({
        where: {
          id: input.recipeId,
          createdById: ctx.session.user.id,
          // The former status is DRAFT, and all fields are not null
          status: RecipeStatus.DRAFT,
          NOT: [
            {
              description: null,
            },
            {
              method: null,
            },
            {
              time: null,
            },
            {
              difficultyId: null,
            },
            {
              servings: null,
            },
            {
              ingredients: { equals: undefined },
            },
          ],
        },
      })

      if (!completedRecipe) {
        throw new Error('Recipe is not completed')
      }

      return await ctx.db.recipe.update({
        where: {
          id: completedRecipe.id,
        },
        data: {
          status: RecipeStatus.PUBLISHED,
        },
      })
    }),

  unpublish: protectedProcedure
    .input(z.object({ recipeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.recipe.update({
        where: {
          id: input.recipeId,
          createdById: ctx.session.user.id,
          status: RecipeStatus.PUBLISHED,
        },
        data: {
          status: RecipeStatus.DRAFT,
        },
      })
    }),

  getNameById: publicProcedure
    .input(z.object({ recipeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.db.recipe.findUnique({
        where: {
          id: input.recipeId,
        },
        select: {
          name: true,
        },
      })

      if (!recipe) {
        throw new Error('Recipe not found')
      }

      return recipe.name
    }),
})
