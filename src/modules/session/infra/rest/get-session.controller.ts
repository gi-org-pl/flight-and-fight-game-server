import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetSessionQuery } from '../../application/query/get-session.query';
import { Session } from '../database/session.entity';
import { GetSessionResponse } from './dto/get-session.response';
import { GenericNotFoundResponse } from '../../../../core/http/response/not-found.response';
import { UlidParam } from '../../../../core/validation/decorator/ulid-param.decorator';

@ApiTags('sessions')
@Controller('sessions')
export class GetSessionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @ApiOperation({ summary: 'Returns the current state of a session' })
  @ApiOkResponse({ type: GetSessionResponse })
  @ApiNotFoundResponse({ type: GenericNotFoundResponse })
  get(@UlidParam('id') id: string): Promise<GetSessionResponse> {
    return this.queryBus.execute<GetSessionQuery, Session>(
      new GetSessionQuery(id),
    );
  }
}
