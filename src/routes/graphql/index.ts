import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { RootQuery } from './query.js';
import { RootMutation } from './mutation.js';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const depthLimitRule = depthLimit(5);
      const errors = validate(schema, parse(query), [depthLimitRule]);
      if (errors.length > 0) {
        return {
          errors: errors.map((error) => ({
            message: error.message,
          })),
        };
      }

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });

      return result;
    },
  });
};

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default plugin;
