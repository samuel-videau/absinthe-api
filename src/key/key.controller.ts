import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { KeyService } from './key.service';
import { CreateKeyDto, CreateKeyResponseDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import { KeyResponseDto } from './dto/key-response.dto';

@ApiTags('keys')
@Controller('keys')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new key' })
  @ApiResponse({
    status: 201,
    description: 'The key has been successfully created.',
    type: CreateKeyResponseDto,
  })
  @ApiBody({ type: CreateKeyDto })
  create(@Body() createKeyDto: CreateKeyDto): Promise<CreateKeyResponseDto> {
    return this.keyService.create(createKeyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all keys' })
  @ApiResponse({
    status: 200,
    description: 'Return all keys for the specified filters.',
    type: [KeyResponseDto],
  })
  findAll(@Query() findKeys: FindKeysDto): Promise<KeyResponseDto[]> {
    return this.keyService.findAll(findKeys);
  }

  @Patch(':keyId')
  @ApiOperation({ summary: 'Update a key' })
  @ApiResponse({ status: 200, description: 'The key has been successfully updated.' })
  @ApiParam({ name: 'keyId', description: 'The ID of the key to update' })
  update(@Param('keyId') keyId: string, @Body() updateKeyDto: UpdateKeyDto): Promise<void> {
    return this.keyService.update(keyId, updateKeyDto);
  }

  @Delete(':keyId')
  @ApiOperation({ summary: 'Remove a key' })
  @ApiResponse({ status: 200, description: 'The key has been successfully removed.' })
  @ApiParam({ name: 'keyId', description: 'The ID of the key to remove' })
  remove(@Param('keyId') keyId: string): Promise<void> {
    return this.keyService.remove(keyId);
  }
}
