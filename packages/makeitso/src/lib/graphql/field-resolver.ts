import {
    defaultFieldResolver,
    GraphQLNonNull,
    GraphQLOutputType,
    isLeafType,
    isListType,
    isNullableType,
    isObjectType,
} from 'graphql';
import isClass from 'is-class';
import { Resolver } from './types';
import resolverScalarValue from './resolve-scalar-value';

type Resolvers = {
    [key: string]: Resolver;
};

const resolveObjectValue = (type: string, resolvers: Resolvers) => {
    const resolver = resolvers[type];
    if (resolver) {
        return isClass(resolver) ? new resolver() : resolver;
    }

    return undefined;
};

const fieldResolver: typeof defaultFieldResolver = (parent, args, context, info): unknown => {
    const type = info.returnType;
    const resolvers = context.resolvers as Resolvers;
    if (isNullableType(type)) {
        return null;
    }

    const realType = (type as GraphQLNonNull<GraphQLOutputType>).ofType;

    let value = defaultFieldResolver(parent, args, context, info);
    if (value !== null && value !== undefined) {
        return value;
    }

    const parentType = info.parentType.name;
    if (parentType) {
        const newParent = resolveObjectValue(parentType, resolvers);
        if (newParent) {
            value = defaultFieldResolver(newParent, args, context, info);
            if (value !== null && value !== undefined) {
                return value;
            }
        }
    }

    if (isLeafType(realType)) {
        return resolverScalarValue(realType);
    }

    if (isListType(realType)) {
        if (isLeafType(realType.ofType)) {
            return [resolverScalarValue(realType.ofType)];
        }

        return [{}];
    }

    if (isObjectType(realType)) {
        const obj = resolveObjectValue(realType.name, resolvers);

        return obj ?? {};
    }

    throw new Error('Not handled right now');
};

export default fieldResolver;
