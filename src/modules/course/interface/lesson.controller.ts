// import { Controller, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../../common/guards/roles.guard';

// @ApiTags('Lessons')
// @Controller('lessons')
// @ApiBearerAuth('JWT Auth')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class LessonController {
//   constructor(
//     private readonly createLessonUseCase: CreateLessonUseCase,
//     private readonly updateLessonUseCase: UpdateLessonUseCase,
//     private readonly deleteLessonUseCase: DeleteLessonUseCase,
//     private readonly getLessonUseCase: GetLessonUseCase,
//     private readonly getLessonsUseCase: GetLessonsUseCase,
//   ) {}
// }
