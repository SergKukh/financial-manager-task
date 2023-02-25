export const createQueryBuilder = {
  select: () => createQueryBuilder,
  update: () => createQueryBuilder,
  delete: () => createQueryBuilder,
  from: () => createQueryBuilder,
  insert: () => createQueryBuilder,
  into: () => createQueryBuilder,
  values: () => createQueryBuilder,
  set: () => createQueryBuilder,
  addSelect: () => createQueryBuilder,
  groupBy: () => createQueryBuilder,
  where: () => createQueryBuilder,
  andWhere: () => createQueryBuilder,
  leftJoinAndSelect: () => createQueryBuilder,
  innerJoin: () => createQueryBuilder,
  relation: () => createQueryBuilder,
  add: () => createQueryBuilder,
  skip: () => createQueryBuilder,
  take: () => createQueryBuilder,
  of: () => createQueryBuilder,
  orderBy: () => createQueryBuilder,
  execute: () => ({}),
  getOne: () => ({}),
  getCount: () => 0,
  getMany: () => [],
  getRawOne: () => ({}),
  getRawMany: () => [],
  getManyAndCount: () => [[], 0],
};

export const mockRepository = {
  createQueryBuilder: () => createQueryBuilder,
};