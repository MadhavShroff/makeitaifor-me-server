import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateMessageVersionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  type: 'user' | 'ai';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMessageDto {
  @IsArray()
  versions: CreateMessageVersionDto[];

  @IsOptional()
  previousMessage: string;
}

export class CreateChatDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  messages: CreateMessageDto[];
}
