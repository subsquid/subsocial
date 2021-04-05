import { isEmptyArray } from '@subsocial/utils';
import { FindOperator } from 'typeorm';
import { SpaceOrderByEnum, SpaceWhereInput } from '../generated';
import { PostWhereInput } from '../generated/binding';
import { PostOrderByEnum } from '../generated/classes';

type OrderByType = SpaceOrderByEnum[] | PostOrderByEnum[];
type WhereInputType = SpaceWhereInput | PostWhereInput | undefined;
type Action = 'select' | 'where' | 'order';

export const camelToSnakeCase = (fields: string[], action: Action) =>
  fields.map(field => {
    const alias = action === 'select' ? ` as "${field}"` : '';
    return field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`) + alias;
  });

export const parseOrderBy = (orderBy?: OrderByType) => {
  if (!orderBy) return '';
  let result: string[] = [];

  if (orderBy && !isEmptyArray(orderBy))
    orderBy.forEach((value: string) => {
      const valueStlited = value.split('_');
      result.push(`${camelToSnakeCase([valueStlited[0]], 'order')} ${valueStlited[1]}`);
    });

  return `order by ${result.join(',')}`;
};

const convertToString = (value: string) => {
  return "'" + value.replace(/GMT\S+\D+/gm, '').trim() + "'";
};

export const getOperation = <T>(op: string, value: T): FindOperator<T> => {
  const possibleStringVlaue =
    typeof value !== 'number' ? convertToString(String(value)) : value;

  const operations: Record<string, any> = {
    eq: `= ${possibleStringVlaue}`,
    lt: `< ${possibleStringVlaue}`,
    lte: `<= ${possibleStringVlaue}`,
    gt: `> ${possibleStringVlaue}`,
    gte: `>= ${possibleStringVlaue}`,
    in: `IN (${value})`,
    contains: `like '%${value}%'`,
    startsWith: `like '${value}%'`,
    endsWith: `like '%${value}'`
  };

  return operations[op];
};

export const parseWhere = (where: WhereInputType, subnetId: string): string => {
  if (!where) return '';
  let result: string[] = [];

  for (const [key, value] of Object.entries(where)) {
    const keySplited = key.split('_');
    result.push(
      `${camelToSnakeCase([keySplited[0]], 'where')} ${getOperation(keySplited[1], value)}`
    );
  }

  return `${subnetId ? 'and ' : 'where'} ${result.join(' and ')}`;
};
