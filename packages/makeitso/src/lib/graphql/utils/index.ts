import {
    DocumentNode,
    EnumTypeDefinitionNode,
    FieldDefinitionNode,
    InterfaceTypeDefinitionNode,
    ListTypeNode,
    ObjectTypeDefinitionNode,
    parse,
    ScalarTypeDefinitionNode,
    Source,
    TypeDefinitionNode,
} from 'graphql';
import { TypeNode } from 'graphql/language/ast';
import { map } from 'utils/dist/object';

export interface Fields {
    [key: string]: Types;
}

type ScalarTypes = 'string' | 'int' | 'float' | 'bool';
type ResolvedTypes = ScalarTypes | 'array' | 'object' | 'unknown' | 'enum';

interface Type {
    type: string;
    required: boolean;
    resolvedType: unknown;
}

export interface ScalarType extends Type {
    resolvedType: ScalarTypes;
}

export interface CustomScalarType extends Type {
    resolvedType: 'unknown';
}

export interface EnumType extends Type {
    resolvedType: 'enum';
    values: string[];
}

export interface ArrayType extends Type {
    resolvedType: 'array';
    children: Types;
}

export interface ObjectType extends Type {
    resolvedType: 'object';
    fields: Fields;
}

export interface InterfaceType extends Type {
    resolvedType: 'interface';
    fields: Fields;
}

export type Types =
    | ScalarType
    | CustomScalarType
    | EnumType
    | ArrayType
    | ObjectType
    | InterfaceType;

export type Object = {
    type: string;
    fields: Fields;
};

export type Structure = Record<string, ObjectType | InterfaceType>;

type TypeMap = typeof typeMap & { [key: string]: never };

const typeMap = {
    ID: 'string',
    String: 'string',
    Int: 'int',
    Float: 'float',
    Boolean: 'bool',
    ListType: 'array',
};

const getResolvedType = (graphQlType: string, context: Context): ResolvedTypes =>
    (typeMap as TypeMap)[graphQlType] ||
    (graphQlType in context.enums ? 'enum' : graphQlType in context.scalars ? 'unknown' : 'object');

const getUnwrappedGraphqlType = (type: TypeNode) =>
    type.kind === 'NonNullType' ? type.type : type;

export const getGraphQlType = (type: TypeNode): string => {
    const unwrappedType = getUnwrappedGraphqlType(type);

    return unwrappedType.kind === 'NamedType' ? unwrappedType.name.value : 'ListType';
};

const getFieldStructure = (field: FieldDefinitionNode | ListTypeNode, context: Context): Types => {
    const required = field.type.kind === 'NonNullType';
    const type = getGraphQlType(field.type);
    const resolvedType = getResolvedType(type, context);

    if (resolvedType === 'array') {
        const unwrappedType = getUnwrappedGraphqlType(field.type);
        const children = getFieldStructure(unwrappedType as ListTypeNode, context);

        return { resolvedType, type, required, children };
    } else if (resolvedType === 'enum') {
        return {
            resolvedType,
            type,
            required,
            values: context.enums[type].values?.map(value => value.name.value) ?? [],
        };
    } else if (resolvedType === 'object') {
        return { resolvedType, type, required, fields: {} as any };
    } else {
        return { resolvedType, type, required };
    }
};

type Scalars = { [key: string]: ScalarTypeDefinitionNode };
type Enums = { [key: string]: EnumTypeDefinitionNode };
type Context = { scalars: Scalars; enums: Enums };

const getObjectStructure = (
    definition: ObjectTypeDefinitionNode,
    context: Context,
): ObjectType => ({
    type: definition.name.value,
    resolvedType: 'object',
    required: true,
    fields: Object.fromEntries(
        definition.fields?.map(field => [field.name.value, getFieldStructure(field, context)]) ??
            ([] as [string, Object][]),
    ),
});

const getInterfaceStructure = (
    definition: InterfaceTypeDefinitionNode,
    context: Context,
): InterfaceType => ({
    type: definition.name.value,
    resolvedType: 'interface',
    required: true,
    fields: Object.fromEntries(
        definition.fields?.map(field => [field.name.value, getFieldStructure(field, context)]) ??
            ([] as [string, Object][]),
    ),
});

const getDefinitions = <T extends TypeDefinitionNode>(doc: DocumentNode, kind: T['kind']) =>
    Object.fromEntries(
        doc.definitions
            .filter((definition): definition is T => definition.kind === kind)
            .map(definition => [definition.name.value, definition]),
    );

export const getStructure = (body: string): Structure => {
    const source = new Source(body.toString());
    const doc = parse(source);

    const scalars = getDefinitions<ScalarTypeDefinitionNode>(doc, 'ScalarTypeDefinition');
    const enums = getDefinitions<EnumTypeDefinitionNode>(doc, 'EnumTypeDefinition');

    const context = { scalars, enums };

    const types = {
        ...map(
            getDefinitions<InterfaceTypeDefinitionNode>(doc, 'InterfaceTypeDefinition'),
            definition => getInterfaceStructure(definition, context),
        ),
        ...map(getDefinitions<ObjectTypeDefinitionNode>(doc, 'ObjectTypeDefinition'), definition =>
            getObjectStructure(definition, context),
        ),
    };

    Object.values(types).forEach(object => {
        if (object.resolvedType === 'object') {
            Object.values(object.fields).forEach(type => {
                if (
                    type.resolvedType === 'array' &&
                    type.children.resolvedType === 'object' &&
                    types[type.children.type]
                ) {
                    type.children = types[type.children.type];
                } else if (type.resolvedType === 'object' && types[type.type]) {
                    Object.assign(type, types[type.type]);
                } else if (type.resolvedType === 'interface' && types[type.type]) {
                    Object.assign(type, types[type.type]);
                }
            });
        }
    });

    return types;
};
