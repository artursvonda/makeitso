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
import { map } from 'utils/dist/object';
import {
    arrayType,
    boolType,
    Context,
    customScalarType,
    enumType,
    floatType,
    getGraphQlType,
    getResolvedType,
    getUnwrappedGraphqlType,
    InterfaceType,
    interfaceType,
    intType,
    ObjectType,
    objectType,
    stringType,
    Types,
} from '../resolvers/types';

export type Structure = { Query?: ObjectType } & { [key: string]: ObjectType | InterfaceType };

const getFieldStructure = (field: FieldDefinitionNode | ListTypeNode, context: Context): Types => {
    const required = field.type.kind === 'NonNullType';
    const type = getGraphQlType(field.type);
    const resolvedType = getResolvedType(type, context);

    switch (resolvedType) {
        case 'array':
            const unwrappedType = getUnwrappedGraphqlType(field.type);
            const children = getFieldStructure(unwrappedType as ListTypeNode, context);

            return arrayType(type, children, required);
        case 'enum':
            return enumType(
                type,
                context.enums[type].values?.map(value => value.name.value) ?? [],
                required,
            );
        case 'object':
            return objectType(type, {}, required);
        case 'string':
            return stringType(type, required);
        case 'int':
            return intType(type, required);
        case 'float':
            return floatType(type, required);
        case 'bool':
            return boolType(type, required);
        case 'unknown':
            return customScalarType(type, required);
        default:
            throw new Error(`Unknown type ${resolvedType}`);
    }
};

const getObjectStructure = (definition: ObjectTypeDefinitionNode, context: Context) =>
    objectType(
        definition.name.value,
        Object.fromEntries(
            definition.fields?.map(field => [
                field.name.value,
                getFieldStructure(field, context),
            ]) ?? [],
        ),
    );

const getInterfaceStructure = (definition: InterfaceTypeDefinitionNode, context: Context) =>
    interfaceType(
        definition.name.value,
        Object.fromEntries(
            definition.fields?.map(field => [
                field.name.value,
                getFieldStructure(field, context),
            ]) ?? [],
        ),
    );

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
