import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as md5 from 'md5';
import { LaLigaNews } from './laliga-news.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NewsApi } from '../api/api.interface';

@Injectable()
export class LaLigaNewsService {
  private readonly cacheExpireTime = 1000 * 60 * 30; // expire in 30 minutes when the next cron runs
  constructor(
    @InjectModel('LaLigaNews') private readonly newsModel: Model<LaLigaNews>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createNews(news: LaLigaNews): Promise<LaLigaNews> {
    // Set the id as the MD5 hash of the URL
    news.id = md5(news.url);

    const createdNews = new this.newsModel(news);
    return createdNews.save();
  }
  async createManyNews(newsArray: NewsApi[]): Promise<number> {
    const writeOperations = newsArray.map((news) => ({
      updateOne: {
        filter: { newsId: md5(news.url) },
        update: { $setOnInsert: { ...news, newsId: md5(news.url) } },
        upsert: true,
      },
    }));

    const result = await this.newsModel.bulkWrite(writeOperations, {
      ordered: false,
    });

    // Clear the cache since the data has changed
    await this.cacheManager.reset();

    return result.upsertedCount;
  }

  async searchNews(query: string): Promise<LaLigaNews[]> {
    // Search by title or short description containing the query string

    const news = await this.cacheManager.get(query);
    if (news) {
      return JSON.parse(news as string) as LaLigaNews[];
    }
    const search: LaLigaNews[] = await this.newsModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
          { shortDesc: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
    if (search.length > 0) {
      await this.cacheManager.set(
        query,
        JSON.stringify(search),
        this.cacheExpireTime,
      );
    }

    return search;
  }

  async emptyRecords(): Promise<void> {
    await this.newsModel.deleteMany({}).exec();
  }

  async recordCount(): Promise<number> {
    return await this.newsModel.countDocuments().exec();
  }
}
