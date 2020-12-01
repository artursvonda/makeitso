import { GraphQLFieldResolver } from 'graphql';

class ResolverClass {}

export type Resolver = Record<string, GraphQLFieldResolver<unknown, unknown>> | ResolverClass;
