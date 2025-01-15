import { Query } from 'mongoose';

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm ? this.query.searchTerm : '';
    const serachableQueryOptions = searchableFields.map((field) => {
      return {
        [field]: { $regex: searchTerm, $options: 'i' },
      };
    });
    this.queryModel = this?.queryModel?.find({ $or: serachableQueryOptions });
    return this;
  }
  filter() {
    const queryObj = { ...this.query };
    const excludeQueryFields = [
      'searchTerm',
      'sort',
      'limit',
      'page',
      'fields',
    ];
    excludeQueryFields.forEach((el: string) => delete queryObj[el]);
    this.queryModel = this?.queryModel?.find(queryObj);
    return this;
  }
  sort() {
    //sort by muliple field
    const numberOfSort = this?.query?.sort
      ? (this?.query?.sort as string).split(',').join(' ')
      : '-createdAt';
    this.queryModel = this?.queryModel?.sort(numberOfSort);
    return this;
  }
  skip() {
    const numberOfLimit = this?.query?.limit ? Number(this?.query?.limit) : 1;
    const numberOfPage = this?.query?.page ? Number(this?.query?.page) : 1;
    const numberOfSkip =
      this?.query?.limit && this?.query?.page
        ? (numberOfPage - 1) * numberOfLimit
        : 1;
    this.queryModel = this?.queryModel?.skip(numberOfSkip);
    return this;
  }
  limit() {
    const numberOfLimit = this.query?.limit ? Number(this.query.limit) : 1;
    this.queryModel = this?.queryModel?.limit(numberOfLimit);
    return this;
  }
  limitFields() {
    const limitFields = this.query?.fields
      ? (this?.query?.fields as string)?.split(',')?.join(' ')
      : '-__v';
    this.queryModel = this?.queryModel?.select(limitFields);
    return this;
  }
}
export default QueryBuilder;
