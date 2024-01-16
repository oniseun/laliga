import { Test, TestingModule } from '@nestjs/testing';
import { LaLigaNewsController } from './laliga-news.controller';
import { LaLigaNewsService } from './laliga-news.service';
import { LaLigaTeamService } from '../team/laliga-team.service';
import { ApiService } from '../api/api.service';
import { NewsApi } from 'src/api/api.interface';
import { NotFoundException } from '@nestjs/common';
import { LaLigaTeam } from '../team/laliga-team.model';
import { LaLigaNews } from './laliga-news.model';

describe('LaLigaNewsController', () => {
  let controller: LaLigaNewsController;
  let newsService: LaLigaNewsService;
  let teamService: LaLigaTeamService;
  let apiService: ApiService;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaLigaNewsController],
      providers: [
        LaLigaNewsService,
        LaLigaTeamService,
        ApiService,
        { provide: 'Logger', useValue: mockLogger },
      ],
    })
      .overrideProvider(LaLigaNewsService)
      .useValue({
        // Mock LaLigaNewsService methods here as needed
        recordCount: jest.fn(),
        createManyNews: jest.fn(),
        searchNews: jest.fn(),
        emptyRecords: jest.fn(),
      })
      .overrideProvider(LaLigaTeamService)
      .useValue({
        // Mock LaLigaTeamService methods here as needed
        getLaligaTeamById: jest.fn(),
      })
      .overrideProvider(ApiService)
      .useValue({
        // Mock ApiService methods here as needed
        getLaLigaNews: jest.fn(),
      })
      .compile();

    controller = module.get<LaLigaNewsController>(LaLigaNewsController);
    newsService = module.get<LaLigaNewsService>(LaLigaNewsService);
    teamService = module.get<LaLigaTeamService>(LaLigaTeamService);
    apiService = module.get<ApiService>(ApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create news when news count is 0', async () => {
      jest.spyOn(newsService, 'recordCount').mockResolvedValue(0);
      jest.spyOn(controller, 'createNews').mockResolvedValue();

      await controller.onModuleInit();

      expect(controller.createNews).toHaveBeenCalledTimes(1);
    });

    it('should not create news when news count is greater than 0', async () => {
      jest.spyOn(newsService, 'recordCount').mockResolvedValue(2);
      jest.spyOn(controller, 'createNews').mockResolvedValue();

      await controller.onModuleInit();

      expect(controller.createNews).not.toHaveBeenCalled();
    });
  });

  describe('createNews', () => {
    it('should fetch and save news successfully', async () => {
      const newsData: NewsApi[] = [
        // ... (mock data)
      ];
      jest.spyOn(apiService, 'getLaLigaNews').mockResolvedValue(newsData);
      jest.spyOn(newsService, 'createManyNews').mockResolvedValue(2);

      await controller.createNews();

      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should handle errors during news fetching', async () => {
      jest
        .spyOn(apiService, 'getLaLigaNews')
        .mockRejectedValue(new Error('Fetch error'));

      await controller.createNews();

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearNewsDB', () => {
    it('should clear the news database successfully', async () => {
      jest.spyOn(newsService, 'emptyRecords').mockResolvedValue();

      await controller.clearNewsDB();

      expect(mockLogger.log).toHaveBeenCalledTimes(2);
    });

    it('should handle errors during news database clearing', async () => {
      jest
        .spyOn(newsService, 'emptyRecords')
        .mockRejectedValue(new Error('Clear error'));

      await controller.clearNewsDB();

      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchNews', () => {
    const mockTeamId = 123;

    it('should search for news successfully', async () => {
      const mockNews = [
        {
          _id: '65a5b350a0bb471d1b44558e',
          newsId: 'fd17cd7be74a62e8ffa2e69953b3f0b4',
          dateCreated: '2024-01-15T22:36:00.407Z',
          shortDesc:
            'Liverpool have joined Real Madrid in the pursuit of the France international',
          title:
            'Liverpool ready to launch audacious swoop for Kylian Mbappe: report',
          url: 'https://www.fourfourtwo.com/news/liverpool-ready-to-launch-audacious-swoop-for-kylian-mbappe-report',
        },
        {
          _id: '65a5b350a0bb471d1b445590',
          newsId: '322a696892137a8ffbe99bf55b31b43a',
          dateCreated: '2024-01-15T22:36:00.407Z',
          shortDesc:
            'Los Blancos are reportedly willing to give the in-demand France attacker until mid-January to accept or reject their final offer',
          title:
            "Kylian Mbappe: Liverpool circle as Real Madrid 'prepare final bid' for PSG forward",
          url: 'https://www.fourfourtwo.com/news/kylian-mbappe-liverpool-circle-as-real-madrid-prepare-final-bid-for-psg-forward',
        },
      ] as unknown as LaLigaNews[];

      jest.spyOn(teamService, 'getLaligaTeamById').mockResolvedValueOnce({
        teamId: mockTeamId,
        teamName: 'Mock Team',
      } as LaLigaTeam);
      jest.spyOn(newsService, 'searchNews').mockResolvedValue(mockNews);

      const result = await controller.searchNews(mockTeamId);

      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(result).toEqual(mockNews);
    });

    it('should throw NotFoundException if team not found', async () => {
      jest.spyOn(teamService, 'getLaligaTeamById').mockResolvedValue(null);

      await expect(controller.searchNews(mockTeamId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle errors during news search', async () => {
      jest.spyOn(teamService, 'getLaligaTeamById').mockResolvedValueOnce({
        teamId: mockTeamId,
        teamName: 'Mock Team',
      } as LaLigaTeam);

      jest
        .spyOn(newsService, 'searchNews')
        .mockRejectedValue(new Error('Search error'));

      const errorSpy = jest.spyOn(mockLogger, 'error');

      await expect(controller.searchNews(mockTeamId)).rejects.toThrowError(
        Error,
      );

      expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
