import { Injectable } from '@nestjs/common';
import { CreateDataMartCommand } from '../dto/domain/create-data-mart.command';
import { CreateDataMartRequestApiDto } from '../dto/presentation/create-data-mart-request-api.dto';
import { CreateDataMartResponseApiDto } from '../dto/presentation/create-data-mart-response-api.dto';
import { DataMartResponseApiDto } from '../dto/presentation/data-mart-response-api.dto';
import { DataMartDto } from '../dto/domain/data-mart.dto';
import { DataMart } from '../entities/data-mart.entity';
import { UpdateDataMartDefinitionApiDto } from '../dto/presentation/update-data-mart-definition-api.dto';
import { UpdateDataMartDefinitionCommand } from '../dto/domain/update-data-mart-definition.command';
import { AuthorizationContext } from '../../common/authorization-context/authorization.context';
import { GetDataMartCommand } from '../dto/domain/get-data-mart.command';
import { ListDataMartsCommand } from '../dto/domain/list-data-marts.command';
import { UpdateDataMartTitleApiDto } from '../dto/presentation/update-data-mart-title-api.dto';
import { UpdateDataMartTitleCommand } from '../dto/domain/update-data-mart-title.command';
import { UpdateDataMartDescriptionApiDto } from '../dto/presentation/update-data-mart-description-api.dto';
import { UpdateDataMartDescriptionCommand } from '../dto/domain/update-data-mart-description.command';
import { PublishDataMartCommand } from '../dto/domain/publish-data-mart.command';
import { DataStorageMapper } from './data-storage.mapper';
import { DeleteDataMartCommand } from '../dto/domain/delete-data-mart.command';

@Injectable()
export class DataMartMapper {
  constructor(private readonly dataStorageMapper: DataStorageMapper) {}

  toCreateDomainCommand(
    context: AuthorizationContext,
    dto: CreateDataMartRequestApiDto
  ): CreateDataMartCommand {
    return new CreateDataMartCommand(context.projectId, context.userId, dto.title, dto.storageId);
  }

  toDomainDto(entity: DataMart): DataMartDto {
    return new DataMartDto(
      entity.id,
      entity.title,
      entity.status,
      this.dataStorageMapper.toDomainDto(entity.storage),
      entity.createdAt,
      entity.modifiedAt,
      entity.definitionType,
      entity.definition,
      entity.description
    );
  }

  toDomainDtoList(entities: DataMart[]): DataMartDto[] {
    return entities.map(entity => this.toDomainDto(entity));
  }

  toCreateResponse(dto: DataMartDto): CreateDataMartResponseApiDto {
    return {
      id: dto.id,
      title: dto.title,
    };
  }

  toResponse(dto: DataMartDto): DataMartResponseApiDto {
    return {
      id: dto.id,
      title: dto.title,
      status: dto.status,
      storage: this.dataStorageMapper.toApiResponse(dto.storage),
      definitionType: dto.definitionType,
      definition: dto.definition,
      description: dto.description,
      createdAt: dto.createdAt,
      modifiedAt: dto.modifiedAt,
    };
  }

  toResponseList(dtos: DataMartDto[]): DataMartResponseApiDto[] {
    return dtos.map(dto => this.toResponse(dto));
  }

  toUpdateDefinitionCommand(
    id: string,
    context: AuthorizationContext,
    dto: UpdateDataMartDefinitionApiDto
  ): UpdateDataMartDefinitionCommand {
    return new UpdateDataMartDefinitionCommand(
      id,
      context.projectId,
      context.userId,
      dto.definitionType,
      dto.definition
    );
  }

  toGetCommand(id: string, context: AuthorizationContext): GetDataMartCommand {
    return new GetDataMartCommand(id, context.projectId, context.userId);
  }

  toListCommand(context: AuthorizationContext): ListDataMartsCommand {
    return new ListDataMartsCommand(context.projectId, context.userId);
  }

  toUpdateTitleCommand(
    id: string,
    context: AuthorizationContext,
    dto: UpdateDataMartTitleApiDto
  ): UpdateDataMartTitleCommand {
    return new UpdateDataMartTitleCommand(id, context.projectId, context.userId, dto.title);
  }

  toUpdateDescriptionCommand(
    id: string,
    context: AuthorizationContext,
    dto: UpdateDataMartDescriptionApiDto
  ): UpdateDataMartDescriptionCommand {
    return new UpdateDataMartDescriptionCommand(
      id,
      context.projectId,
      context.userId,
      dto.description
    );
  }

  toPublishCommand(id: string, context: AuthorizationContext): PublishDataMartCommand {
    return new PublishDataMartCommand(id, context.projectId, context.userId);
  }

  toDeleteCommand(id: string, context: AuthorizationContext): DeleteDataMartCommand {
    return new DeleteDataMartCommand(id, context.projectId, context.userId);
  }
}
