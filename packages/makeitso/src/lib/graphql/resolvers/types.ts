import { EnumTypeDefinitionNode, ScalarTypeDefinitionNode } from 'graphql';
import { TypeNode } from 'graphql/language/ast';

export type ScalarTypes = 'string' | 'int' | 'float' | 'bool';
export type ResolvedTypes = ScalarTypes | 'array' | 'object' | 'unknown' | 'enum';

interface Type {
    type: string;
    required: boolean;
    resolvedType: unknown;
}

export interface ScalarType extends Type {
    resolvedType: ScalarTypes;
}

export const stringType = (type = 'String', required = true): ScalarType => ({
    resolvedType: 'string',
    type,
    required,
});

export const intType = (type = 'Int', required = true): ScalarType => ({
    resolvedType: 'int',
    type,
    required,
});

export const floatType = (type = 'Float', required = true): ScalarType => ({
    resolvedType: 'float',
    type,
    required,
});

export const boolType = (type = 'Boolean', required = true): ScalarType => ({
    resolvedType: 'bool',
    type,
    required,
});

export interface CustomScalarType extends Type {
    resolvedType: 'unknown';
}

export const customScalarType = (type: string, required = true): CustomScalarType => ({
    resolvedType: 'unknown',
    type,
    required,
});

export interface EnumType extends Type {
    resolvedType: 'enum';
    values: string[];
}

export const enumType = (type: string, values: string[], required = true): EnumType => ({
    resolvedType: 'enum',
    type,
    values,
    required,
});

export interface ArrayType extends Type {
    resolvedType: 'array';
    children: Types;
}

export const arrayType = (type: string, children: Types, required = true): ArrayType => ({
    resolvedType: 'array',
    type,
    children,
    required,
});

export interface ObjectType extends Type {
    resolvedType: 'object';
    fields: Fields;
}

export const objectType = (type: string, fields: Fields, required = true): ObjectType => ({
    resolvedType: 'object',
    type,
    fields,
    required,
});

export interface InterfaceType extends Type {
    resolvedType: 'interface';
    fields: Fields;
}

export const interfaceType = (type: string, fields: Fields, required = true): InterfaceType => ({
    resolvedType: 'interface',
    type,
    fields,
    required,
});

export type Types =
    | ScalarType
    | CustomScalarType
    | EnumType
    | ArrayType
    | ObjectType
    | InterfaceType;

export interface Fields {
    [key: string]: Types;
}

type TypeMap = typeof typeMap & { [key: string]: never };

const typeMap = {
    ID: 'string',
    String: 'string',
    Int: 'int',
    Float: 'float',
    Boolean: 'bool',
    ListType: 'array',
};

type Scalars = { [key: string]: ScalarTypeDefinitionNode };
type Enums = { [key: string]: EnumTypeDefinitionNode };
export type Context = { scalars: Scalars; enums: Enums };

export const getResolvedType = (graphQlType: string, context: Context): ResolvedTypes =>
    (typeMap as TypeMap)[graphQlType] ||
    (graphQlType in context.enums ? 'enum' : graphQlType in context.scalars ? 'unknown' : 'object');

export const getUnwrappedGraphqlType = (type: TypeNode) =>
    type.kind === 'NonNullType' ? type.type : type;

export const getGraphQlType = (type: TypeNode): string => {
    const unwrappedType = getUnwrappedGraphqlType(type);

    return unwrappedType.kind === 'NamedType' ? unwrappedType.name.value : 'ListType';
};
