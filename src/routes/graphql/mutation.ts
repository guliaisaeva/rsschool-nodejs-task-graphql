// import {
//   GraphQLObjectType,
//   GraphQLNonNull,
//   GraphQLString,
//   GraphQLBoolean,
// } from 'graphql';
// import {
//   ChangePostInput,
//   ChangeUserInput,
//   CreatePostInput,
//   CreateProfileInput,
//   CreateUserInput,
//   Post,
//   Profile,
//   UserType,
// } from './types/types.js';
// import { UUIDType } from './types/uuid.js';
// import { PrismaClient } from '@prisma/client';
// import { FastifyInstance } from 'fastify';
// import { MemberTypeId } from '../member-types/schemas.js';

// export const RootMutation = new GraphQLObjectType({
//   name: 'Mutations',
//   fields: {
//     createUser: {
//       type: UserType,
//       args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
//       async resolve(
//         _,
//         args: { dto: { name: string; balance: number } },
//         { prisma }: FastifyInstance,
//       ) {
//         return prisma.user.create({ data: args.dto });
//       },
//     },
//     deleteUser: {
//       type: GraphQLBoolean,
//       args: { id: { type: new GraphQLNonNull(UUIDType) } },
//       resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
//         try {
//           await prisma.user.delete({ where: { id } });
//           return true;
//         } catch {
//           return false;
//         }
//       },
//     },

//     updateUser: {
//       type: UserType,
//       args: {
//         id: { type: new GraphQLNonNull(UUIDType) },
//         dto: { type: ChangeUserInput },
//       },
//       resolve: async (
//         _,
//         args: { id: string; dto: { name: string; balance: number } },
//         { prisma }: FastifyInstance,
//       ) => {
//         const { id, dto } = args;
//         return await prisma.user.update({
//           where: { id: id },
//           data: dto,
//         });
//       },
//     },
//     createPost: {
//       type: Post,
//       args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
//       resolve: async (
//         _,
//         args: { dto: { title: string; content: string; authorId: string } },
//         { prisma }: FastifyInstance,
//       ) => {
//         return await prisma.post.create({ data: args.dto });
//       },
//     },
//     deletePost: {
//       type: GraphQLBoolean,
//       args: { id: { type: new GraphQLNonNull(UUIDType) } },
//       resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
//         try {
//           await prisma.post.delete({ where: { id } });
//           return true;
//         } catch {
//           return false;
//         }
//       },
//     },
//     changePost: {
//       type: Post,
//       args: {
//         id: { type: new GraphQLNonNull(UUIDType) },
//         dto: { type: ChangePostInput },
//       },
//       resolve: async (
//         _,
//         args: { id: string; dto: { title: string; content: string } },
//         { prisma }: FastifyInstance,
//       ) => {
//         const { id, dto } = args;
//         return await prisma.post.update({
//           where: { id: id },
//           data: dto,
//         });
//       },
//     },
//     createProfile: {
//       type: Profile,
//       args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
//       resolve: async (
//         _,
//         args: {
//           dto: {
//             isMale: boolean;
//             yearOfBirth: number;
//             memberTypeId: MemberTypeId;
//             userId: string;
//           };
//         },
//         { prisma }: FastifyInstance,
//       ) => {
//         return await prisma.profile.create({ data: args.dto });
//       },
//     },

//     subscribeTo: {
//       type: UserType,
//       args: {
//         userId: { type: UUIDType },
//         authorId: { type: UUIDType },
//       },
//       resolve: async (
//         _,
//         args: { userId: string; authorId: string },
//         { prisma }: FastifyInstance,
//       ) => {
//         await prisma.user.update({
//           where: {
//             id: args.userId,
//           },
//           data: {
//             userSubscribedTo: {
//               create: {
//                 authorId: args.authorId,
//               },
//             },
//           },
//         });
//       },
//     },

//     unsubscribeFrom: {
//       type: GraphQLBoolean,
//       args: {
//         userId: { type: UUIDType },
//         authorId: { type: UUIDType },
//       },
//       resolve: async (
//         _,
//         args: { userId: string; authorId: string },
//         { prisma }: FastifyInstance,
//       ) => {
//         const unsubscribed = await prisma.subscribersOnAuthors.delete({
//           where: {
//             subscriberId_authorId: {
//               subscriberId: args.userId,
//               authorId: args.authorId,
//             },
//           },
//         });

//         return unsubscribed ? true : false;
//       },
//     },
//   },
// });

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import {
  ChangePostInput,
  ChangeUserInput,
  CreatePostInput,
  CreateProfileInput,
  CreateUserInput,
  Post,
  Profile,
  UserType,
} from './types/types.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { MemberTypeId } from '../member-types/schemas.js';

export const RootMutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      async resolve(_parent, { dto }, { prisma }) {
        try {
          return await prisma.user.create({ data: dto });
        } catch (error) {
          throw new Error('Failed to create user');
        }
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      async resolve(_parent, { id }, { prisma }) {
        try {
          await prisma.user.delete({ where: { id } });
          return true;
        } catch (error) {
          return false;
        }
      },
    },

    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeUserInput },
      },
      async resolve(_parent, { id, dto }, { prisma }) {
        try {
          return await prisma.user.update({
            where: { id },
            data: dto,
          });
        } catch (error) {
          throw new Error('Failed to update user');
        }
      },
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      async resolve(_, { dto }, { prisma }) {
        try {
          return await prisma.post.create({ data: dto });
        } catch (error) {
          throw new Error('Failed to create post');
        }
      },
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: (_, args, { prisma }) =>
        prisma.post
          .delete({
            where: { id: args.id },
          })
          .then(() => null),
    },

    changePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInput },
      },
      async resolve(_parent, { id, dto }, { prisma }) {
        try {
          return await prisma.post.update({
            where: { id },
            data: dto,
          });
        } catch (error) {
          throw new Error('Failed to update post');
        }
      },
    },
    createProfile: {
      type: Profile,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      async resolve(_parent, { dto }, { prisma }) {
        try {
          return await prisma.profile.create({ data: dto });
        } catch (error) {
          throw new Error('Failed to create profile');
        }
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_parent, { userId, authorId }, { prisma }) {
        try {
          const user = await prisma.user.update({
            where: { id: userId },
            data: {
              userSubscribedTo: {
                create: { authorId },
              },
            },
          });
          return user;
        } catch (error) {
          throw new Error('Failed to subscribe');
        }
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_parent, { userId, authorId }, { prisma }) {
        try {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId,
              },
            },
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
  },
});
