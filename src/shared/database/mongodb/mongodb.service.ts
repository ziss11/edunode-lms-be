import { Inject, Injectable } from '@nestjs/common';
import {
  Collection,
  Db,
  Document,
  Filter,
  MatchKeysAndValues,
  OptionalUnlessRequiredId,
  Sort,
} from 'mongodb';
import { MONGODB_DATABASE } from './mongodb.module';

@Injectable()
export class MongodbService {
  constructor(@Inject(MONGODB_DATABASE) private readonly db: Db) {}

  getCollection<T extends Document>(name: string): Collection<T> {
    return this.db.collection<T>(name);
  }

  async insertOne<T extends Document>(
    collectionName: string,
    document: OptionalUnlessRequiredId<T>,
  ): Promise<T> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.insertOne(document);
    return { ...document, _id: result.insertedId } as T;
  }

  async findMany<T extends Document>(
    collectionName: string,
    filter: Filter<T> = {},
    options?: { limit?: number; skip?: number; sort?: Sort },
  ): Promise<T[]> {
    const collection = this.getCollection<T>(collectionName);
    let query = collection.find(filter);

    if (options?.sort) {
      query = query.sort(options.sort);
    }
    if (options?.skip) {
      query = query.skip(options.skip);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const result = await query.toArray();
    return result.map(({ _id: _, ...rest }) => rest as unknown as T);
  }

  async updateOne<T extends Document>(
    collectionName: string,
    filter: Filter<T>,
    update: MatchKeysAndValues<T> | undefined,
  ): Promise<boolean> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.updateOne(filter, { $set: update });
    return result.modifiedCount > 0;
  }

  async deleteOne<T extends Document>(
    collectionName: string,
    filter: Filter<T>,
  ): Promise<boolean> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.deleteOne(filter);
    return result.deletedCount > 0;
  }

  async count(
    collectionName: string,
    filter: Filter<Document>,
  ): Promise<number> {
    const collection = this.getCollection(collectionName);
    return await collection.countDocuments(filter);
  }
}
