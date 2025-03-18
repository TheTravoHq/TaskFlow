import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@UseGuards(JWTAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Req() req: any,
  ) {
    console.log(req, 'req');
    return this.tasksService.createTask(req.user.id, title, description);
  }

  @Get(':userId')
  async getTasksByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.tasksService.getTasksByUserId(userId);
  }

  @Patch(':taskId/start')
  async startTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.startTask(taskId);
  }

  @Patch(':taskId/end')
  async endTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.endTask(taskId);
  }

  @Patch(':taskId/pause')
  async pauseTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.pauseTask(taskId);
  }

  @Patch(':taskId/resume')
  async resumeTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.tasksService.resumeTask(taskId);
  }
}
