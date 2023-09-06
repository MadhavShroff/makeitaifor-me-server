export declare class CreateMessageVersionDto {
    text: string;
    type: 'user' | 'ai';
    isActive?: boolean;
}
export declare class CreateMessageDto {
    versions: CreateMessageVersionDto[];
    previousMessage: string;
}
export declare class CreateChatDto {
    userId: string;
    messages: CreateMessageDto[];
}
