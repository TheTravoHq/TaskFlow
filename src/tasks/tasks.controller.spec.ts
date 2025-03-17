import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    createTask: jest.fn(),
    getTasksByUserId: jest.fn(),
    startTask: jest.fn(),
    pauseTask: jest.fn(),
    resumeTask: jest.fn(),
    endTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const mockResult = { task: { id: 1 }, allTasks: [] };
      mockTasksService.createTask.mockResolvedValue(mockResult);

      const result = await controller.createTask(1, 'Test', 'Description');
      expect(result).toBe(mockResult);
      expect(service.createTask).toHaveBeenCalledWith(1, 'Test', 'Description');
    });
  });

  describe('task operations', () => {
    it('should handle start/pause/resume/end operations', async () => {
      const mockResult = { task: { id: 1 }, allTasks: [] };
      mockTasksService.startTask.mockResolvedValue(mockResult);
      mockTasksService.pauseTask.mockResolvedValue(mockResult);
      mockTasksService.resumeTask.mockResolvedValue(mockResult);
      mockTasksService.endTask.mockResolvedValue(mockResult);

      expect(await controller.startTask(1)).toBe(mockResult);
      expect(await controller.pauseTask(1)).toBe(mockResult);
      expect(await controller.resumeTask(1)).toBe(mockResult);
      expect(await controller.endTask(1)).toBe(mockResult);
    });
  });
});
