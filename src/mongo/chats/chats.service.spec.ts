import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat, MessageVersion } from './chat.schema';
import { Types } from 'mongoose';

// TODO: Fix tests, add tests for all methods.

const mockChat = {
  messages: [],
  save: jest.fn().mockResolvedValue(this),
};

const mockChatModel = {
  findById: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
};

describe('ChatsService', () => {
  let service: ChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModel,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createChat', () => {
    it('should create a chat and return it', async () => {
      const userId = new Types.ObjectId();
      mockChatModel.save.mockResolvedValueOnce(mockChat);

      const chat = await service.createChat(userId);

      expect(chat).toBeDefined();
    });
  });

  describe('findChatByUserId', () => {
    it('should find and return a chat by userId', async () => {
      const userId = new Types.ObjectId();
      mockChatModel.findOne.mockResolvedValueOnce(mockChat);

      const chat = await service.findChatByUserId(userId);

      expect(chat).toBeDefined();
    });
  });

  describe('appendMessage', () => {
    it('should append a message to a chat and return the updated chat', async () => {
      const chatId = new Types.ObjectId();
      const message: Partial<MessageVersion> = {
        text: 'Hello',
        type: 'text',
        isActive: true,
        createdAt: new Date(),
        versionNumber: 1,
      };

      mockChatModel.findById.mockResolvedValueOnce({
        ...mockChat,
        save: jest.fn().mockResolvedValueOnce(mockChat),
      });

      const chat = await service.appendMessage(
        chatId,
        message as MessageVersion,
      );

      expect(chat).toBeDefined();
    });
  });

  // Additional test cases for updateMessage, fetchActiveChatStream, setActiveVersion, etc.
});
