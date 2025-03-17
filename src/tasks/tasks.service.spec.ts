import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from 'prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const mockTask = { id: 1, userId: 1, title: 'Test', status: 'pending' };
      mockPrismaService.task.create.mockResolvedValue(mockTask);
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);

      const result = await service.createTask(1, 'Test', 'Description');
      expect(result.task).toBe(mockTask);
      expect(result.allTasks).toEqual([mockTask]);
    });
  });

  describe('startTask', () => {
    it('should throw error if task is already in progress', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({
        status: 'in-progress',
      });
      await expect(service.startTask(1)).rejects.toThrow(BadRequestException);
    });
  });
});
