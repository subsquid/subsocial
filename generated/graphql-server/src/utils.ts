import { isEmptyArray } from '@subsocial/utils';
import { FindOperator } from 'typeorm';
import { SpaceOrderByEnum, SpaceWhereInput } from '../generated';
import { PostWhereInput } from '../generated/binding';
import { PostOrderByEnum } from '../generated/classes';

type OrderByType = SpaceOrderByEnum[] | PostOrderByEnum[];
type WhereInputType = SpaceWhereInput | PostWhereInput | undefined;
type Action = 'select' | 'where' | 'order';
type WhereType = string | string[] | number | number[];

export const camelToSnakeCase = (fields: string[], action: Action) =>
  fields.map(field => {
    const alias = action === 'select' ? ` as "${field}"` : '';
    return field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`) + alias;
  });

const convertToString = (value: string) => {
  return "'" + value.replace(/GMT\S+\D+/gm, '').trim() + "'";
};

const possibleStringVlaue = (value: WhereType) =>
  typeof value !== 'number' ? convertToString(String(value)) : value;

const parseArrayValues = (values: any[]) =>
  values.map(value => (Number.isInteger(value) ? value : `'${value}'`));

const operations: Record<string, any> = {
  eq: (value: WhereType) => `= ${possibleStringVlaue(value)}`,
  lt: (value: WhereType) => `< ${possibleStringVlaue(value)}`,
  lte: (value: WhereType) => `<= ${possibleStringVlaue(value)}`,
  gt: (value: WhereType) => `> ${possibleStringVlaue(value)}`,
  gte: (value: WhereType) => `>= ${possibleStringVlaue(value)}`,
  in: (value: WhereType) => `in (${parseArrayValues(value as any[])})`,
  contains: (value: WhereType) => `like '%${value}%'`,
  startsWith: (value: WhereType) => `like '${value}%'`,
  endsWith: (value: WhereType) => `like '%${value}'`
};

export const getOperation = <T>(op: string, value: T): FindOperator<T> => operations[op](value);

export const parseWhere = (where: WhereInputType, subnetQueryPart?: string): string => {
  if (!where) return subnetQueryPart ? `where ${subnetQueryPart}` : '';

  let result: string[] = [];

  Object.entries(where).map(([key, value]) => {
    const keySplited = key.split('_');
    result.push(
      `${camelToSnakeCase([keySplited[0]], 'where')} ${getOperation(keySplited[1], value)}`
    );
  });

  return `where ${subnetQueryPart ? `${subnetQueryPart} and` : ''} ${result.join(' and ')}`;
};

export const parseOrderBy = (orderBy?: OrderByType) => {
  if (!orderBy) return '';
  let result: string[] = [];
  const params: Record<string, any> = {};

  if (orderBy && !isEmptyArray(orderBy)) {
    orderBy.forEach((value: string) => {
      const valueStlited = value.split('_');
      result.push(`${camelToSnakeCase([valueStlited[0]], 'order')} ${valueStlited[1]}`);
    });
  }

  return `order by ${result.join(',')}`;
};

export const parseOffset = (offset: number | undefined) =>
  offset && Number.isInteger(offset) ? `offset :offset` : '';

export const parseLimit = (limit: number | undefined) =>
  limit && Number.isInteger(limit) ? `limit :limit` : '';
