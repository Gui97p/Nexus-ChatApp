import { describe, it, expect } from 'vitest';
import { CreateMessageSchema, UpdateMessageSchema } from '../../../src/modules/message/message.schema';

describe('createMessageSchema', () => {
    it('should pass validation without responseId', () => {
        const validData = {
            content: 'John Doe'
        };

        expect(() => CreateMessageSchema.parse(validData)).not.toThrow();
    });

    it('should pass validation with a valid CUID as responseId', () => {
        const validData = {
            content: 'oi',
            responseId: 'cmh81917b0001p93xczg5vlkg'
        }

        expect(() => CreateMessageSchema.parse(validData)).not.toThrow();
    });

    it('should not pass validation with a empty content string', () => {
        const invalidData = {
            content: ''
        }

        expect(() => CreateMessageSchema.parse(invalidData)).toThrow();
    });

    it('should not pass validation with an invalid CUID as responseId', () => {
        const invalidData = {
            content: 'abc',
            responseId: 'invalid-response-id'
        }

        expect(() => CreateMessageSchema.parse(invalidData)).toThrow();
    });
});

describe('updateMessageSchema', () => {
    it('should pass validation with a valid content', () => {
        const validData = {
            content: 'John Doe'
        };

        expect(() => CreateMessageSchema.parse(validData)).not.toThrow();
    });

    it('should not pass validation with a empty content string', () => {
        const invalidData = {
            content: ''
        }

        expect(() => CreateMessageSchema.parse(invalidData)).toThrow();
    });
});