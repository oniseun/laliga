import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as md5 from 'md5';
import { LaLigaNews } from './laliga-news.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NewsApi } from '../api/api.interface';

// Injectable decorator indicates that this class can be managed by NestJS dependency injection system
@Injectable()
export class LaLigaNewsService {
  // Cache expiration time in milliseconds (30 minutes)
  private readonly cacheExpireTime = 1000 * 60 * 30;

  // Constructor with dependency injection
  constructor(
    @InjectModel('LaLigaNews') private readonly newsModel: Model<LaLigaNews>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Method to create a single news item
  async createNews(news: LaLigaNews): Promise<LaLigaNews> {
    // Set the id as the MD5 hash of the URL
    news.id = md5(news.url);

    // Create a new news item and save it to the database
    const createdNews = new this.newsModel(news);
    return createdNews.save();
  }

  // Method to create multiple news items in bulk
  async createManyNews(newsArray: NewsApi[]): Promise<number> {
    // Create bulk write operations for each news item
    const writeOperations = newsArray.map((news) => ({
      updateOne: {
        filter: { newsId: md5(news.url) },
        update: { $setOnInsert: { ...news, newsId: md5(news.url) } },
        upsert: true, // Insert if not exists
      },
    }));

    // Execute bulk write operations
    const result = await this.newsModel.bulkWrite(writeOperations, {
      ordered: false, // Continue with other operations even if some fail
    });

    // Clear the cache since the data has changed
    await this.cacheManager.reset();

    // Return the count of upserted (inserted) news items
    return result.upsertedCount;
  }

  // Method to search for news items based on a query string
  async searchNews(query: string): Promise<LaLigaNews[]> {
    // Attempt to retrieve search results from cache
    const news = await this.cacheManager.get(query);
    if (news) {
      // If cached results exist, parse and return them
      return JSON.parse(news as string) as LaLigaNews[];
    }

    // If not in cache, perform a database query for news items matching the query
    const search: LaLigaNews[] = await this.newsModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive search in title
          { shortDesc: { $regex: query, $options: 'i' } }, // Case-insensitive search in short description
        ],
      })
      .exec();

    // If search results are found, store them in the cache with a set expiration time
    if (search.length > 0) {
      await this.cacheManager.set(
        query,
        JSON.stringify(search),
        this.cacheExpireTime,
      );
    }

    // Return the search results
    return search;
  }

  // Method to delete all records in the database
  async emptyRecords(): Promise<void> {
    await this.newsModel.deleteMany({}).exec();
  }

  // Method to retrieve the count of records in the database
  async recordCount(): Promise<number> {
    return await this.newsModel.countDocuments().exec();
  }
}
