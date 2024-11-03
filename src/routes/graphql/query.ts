import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberType, MemberTypeId, Post, Profile, UserType } from './types/types.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent, _args, { prisma }) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_parent, { id }, { prisma }) => {
        return await prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _args, { prisma }) => {
        return await prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }, { prisma }) => {
        return await prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(Post)),
      resolve: async (_parent, _args, { prisma }) => {
        return await prisma.post.findMany();
      },
    },
    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }, { prisma }) => {
        return await prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(Profile)),
      resolve: async (_parent, _args, { prisma }) => {
        return await prisma.profile.findMany();
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }, { prisma }) => {
        return await prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
