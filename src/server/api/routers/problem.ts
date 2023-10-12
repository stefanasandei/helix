import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { testCode } from "~/utils/code";

export const problemRouter = createTRPCRouter({
  getProblems: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      const problems = await ctx.prisma.problem.findMany({
        take: input.limit,
        include: { author: { select: { name: true, id: true } } },
      });
      return problems.filter((problem) => problem.draft == false);
    }),
  getProblemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const problem = await ctx.prisma.problem.findUnique({
        where: { id: input.id },
        include: {
          author: { select: { name: true, id: true } },
          tests: { select: { input: true, output: true } },
        },
      });
      if (problem?.draft && ctx.session?.user.id != problem.authorId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this draft.",
        });
      return problem;
    }),
  postProblemDraft: protectedProcedure
    .input(
      z.object({
        authorId: z.string().cuid(),
        title: z.string(),
        source: z.string(),
        sourceLink: z.string(),
        statement: z.string(),
        inputFormat: z.string(),
        outputFormat: z.string(),
        notes: z.string(),
        tags: z.array(z.string()),
        difficulty: z.string(),
        timeLimitMs: z.number(),
        memLimitBytes: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.problem.create({
        data: {
          authorId: input.authorId,
          title: input.title,
          source: input.source,
          sourceLink: input.sourceLink,
          statement: input.statement,
          inputFormat: input.inputFormat,
          outputFormat: input.outputFormat,
          notes: input.notes,
          tags: input.tags,
          difficulty: input.difficulty,
          timeLimitMs: input.timeLimitMs,
          memLimitBytes: input.memLimitBytes,
          draft: true,
        },
      });
    }),
  addTestsToDraft: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        input: z.string(),
        output: z.string(),
        points: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.problem.update({
        where: { id: input.id },
        data: {
          tests: {
            create: {
              input: input.input,
              output: input.output,
              points: input.points,
            },
          },
        },
      });
    }),
  addExampleToDraft: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        input: z.string(),
        output: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.problem.update({
        where: { id: input.id },
        data: {
          inputs: { push: input.input },
          outputs: { push: input.output },
        },
      });
    }),
  submitToReview: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: actually submit for review in the future...
      await ctx.prisma.problem.update({
        where: { id: input.id },
        data: {
          draft: false,
        },
      });
    }),
  getSubmissions: publicProcedure
    .input(
      z.object({
        problemId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session == null)
        return [];

      return await ctx.prisma.submission.findMany({
        where: { problemId: input.problemId, userId: ctx.session.user.id },
        include: {
          problem: { select: { id: true, title: true } },
          user: { select: { id: true, name: true } },
          tests: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),
  sendSubmission: publicProcedure
    .input(
      z.object({
        source: z.string(),
        language: z.string(),
        problemId: z.number(),
        isAnon: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tests = await ctx.prisma.test.findMany({
        where: { problemId: input.problemId },
      });

      // refactor to do this on the client
      // if it takes > 10 seconds
      // known problems: compile errors in client's code
      const res = await testCode(input.source, input.language, tests);
      if (res == undefined)
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Error while parsing request on the server",
        });

      let totalScore = 0;
      const submissionData = {
        problemId: input.problemId,
        source: input.source,
        language: input.language,
        tests: res.map((test) => {
          totalScore += test.points;
          return {
            passed: test.points != 0,
            points: test.points,
          };
        }),
      };

      if (input.isAnon || ctx.session == null) {
        return submissionData;
      }

      // user is authed, add that submission

      const submission = await ctx.prisma.submission.create({
        data: {
          problemId: input.problemId,
          userId: ctx.session.user.id,
          source: input.source,
          language: input.language,
          tests: {
            createMany: {
              data: res.map((test) => {
                return {
                  passed: test.points != 0,
                  points: test.points,
                };
              }),
            },
          }
        },
      });

      if (totalScore == 100) {
        const solved = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { solved_problems: true },
        });

        if (!solved?.solved_problems.includes(input.problemId)) {
          await ctx.prisma.user.update({
            where: { id: ctx.session.user.id },
            data: { solved_problems: { push: input.problemId } },
          });
          await ctx.prisma.problem.update({
            where: { id: input.problemId },
            data: { solvedBy: { increment: 1 } },
          });
        }
      }

      return submission;
    }),
  getProgress: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session == undefined) {
      return { count: 0, progress: 0.0 };
    }

    const userData = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { solved_problems: true },
    });

    if (userData == undefined) {
      return { count: 0, progress: 0.0 };
    }

    const problemsCount = await ctx.prisma.problem.count();

    return {
      count: userData.solved_problems.length,
      progress: (userData.solved_problems.length / problemsCount) * 100.0,
    };
  }),
});
