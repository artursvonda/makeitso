import initDebug from 'debug';
import {
    DocumentNode,
    EnumTypeDefinitionNode,
    FieldDefinitionNode,
    ListTypeNode,
    ObjectTypeDefinitionNode,
    parse,
    ScalarTypeDefinitionNode,
    Source,
    TypeDefinitionNode,
} from 'graphql';
import { TypeNode } from 'graphql/language/ast';

const debug = initDebug('makeitso: build');

export interface Structure {
    [key: string]: Field;
}

type ScalarTypes = 'string' | 'int' | 'float' | 'bool';
type Types = ScalarTypes | 'array' | 'object' | 'unknown' | 'enum';

interface FieldBase {
    type: string;
    required: boolean;
}

export interface ScalarField extends FieldBase {
    resolvedType: ScalarTypes;
}

export interface CustomScalarField extends FieldBase {
    resolvedType: 'unknown';
}

export interface EnumField extends FieldBase {
    resolvedType: 'enum';
    children: string[];
}

export interface ArrayField extends FieldBase {
    resolvedType: 'array';
    children: Field;
}

export interface ObjectField extends FieldBase {
    resolvedType: 'object';
    children: Structure;
}

export type Field = ScalarField | CustomScalarField | EnumField | ArrayField | ObjectField;

type TypeMap = typeof typeMap & { [key: string]: never };

const typeMap = {
    ID: 'string',
    String: 'string',
    Int: 'int',
    Float: 'float',
    Boolean: 'bool',
    ListType: 'array',
};

const getResolvedType = (graphQlType: string, context: Context): Types =>
    (typeMap as TypeMap)[graphQlType] ||
    (graphQlType in context.enums ? 'enum' : graphQlType in context.scalars ? 'unknown' : 'object');

const getUnwrappedGraphqlType = (type: TypeNode) =>
    type.kind === 'NonNullType' ? type.type : type;

export const getGraphQlType = (type: TypeNode): string => {
    const unwrappedType = getUnwrappedGraphqlType(type);

    return unwrappedType.kind === 'NamedType' ? unwrappedType.name.value : 'ListType';
};

const getFieldStructure = (field: FieldDefinitionNode | ListTypeNode, context: Context): Field => {
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
            children: context.enums[type].values?.map(value => value.name.value) ?? [],
        };
    } else if (resolvedType === 'object') {
        return { resolvedType, type, required, children: {} };
    } else {
        return { resolvedType, type, required };
    }
};

type Scalars = { [key: string]: ScalarTypeDefinitionNode };
type Enums = { [key: string]: EnumTypeDefinitionNode };
type Context = { scalars: Scalars; enums: Enums };

const _getStructure = (definition: ObjectTypeDefinitionNode, context: Context): Structure =>
    Object.fromEntries(
        definition.fields?.map(field => [field.name.value, getFieldStructure(field, context)]) ??
            ([] as [string, Field][]),
    );

const getDefinitions = <T extends TypeDefinitionNode>(doc: DocumentNode, kind: string) =>
    Object.fromEntries(
        doc.definitions
            .filter((definition): definition is T => definition.kind === kind)
            .map(definition => [definition.name.value, definition]),
    );

export const getStructure = (body: string) => {
    const source = new Source(body.toString());
    const doc = parse(source);

    const scalars = getDefinitions<ScalarTypeDefinitionNode>(doc, 'ScalarTypeDefinition');
    const enums = getDefinitions<EnumTypeDefinitionNode>(doc, 'EnumTypeDefinition');

    const context = { scalars, enums };

    const types = Object.fromEntries(
        doc.definitions
            .filter(
                (definition): definition is ObjectTypeDefinitionNode =>
                    definition.kind === 'ObjectTypeDefinition',
            )
            .map(definition => [definition.name.value, _getStructure(definition, context)]),
    );

    if (!types.Query) {
        debug('Missing root');

        throw new Error('Missing Query type in schema');
    }

    Object.values(types).forEach(structure => {
        Object.values(structure).forEach(field => {
            if (field.resolvedType === 'array' && types[field.children.type]) {
                (field.children as ObjectField).children = types[field.children.type];
            } else if (types[field.type]) {
                (field as ObjectField).children = types[field.type];
            }
        });
    });

    return types.Query;
};
