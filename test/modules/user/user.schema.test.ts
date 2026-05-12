import { describe, it, expect } from 'vitest';
import { createUserSchema, updateUserSchema } from '../../../src/modules/user/user.schema';

describe('createUserSchema', () => {
    it('should pass validation with valid data', () => {
        const validData = {
            name: 'John Doe',
            email: 'john@email.com',
            password: 'strongpassword123',
        };

        expect(() => createUserSchema.parse(validData)).not.toThrow();
    });

    it('should fail validation with invalid email', () => {
        const invalidData = {
            name: 'John Doe',
            email: 'invalid-email',
            password: 'strongpassword123',
        };

        expect(() => createUserSchema.parse(invalidData)).toThrow();
    });

    it('should fail validation with short password', () => {
        const invalidData = {
            name: 'John Doe',
            email: 'john@email.com',
            password: 'short',
        };

        expect(() => createUserSchema.parse(invalidData)).toThrow();
    });

    it('should fail validation with short name', () => {
        const invalidData = {
            name: 'Jo',
            email: 'john@email.com',
            password: 'password123',
        };

        expect(() => createUserSchema.parse(invalidData)).toThrow();
    });
});

describe('updateUserSchema', () => {
    it('should pass validation with partial valid data', () => {
        const validData = {
            email: 'jonhdoe@email.com',
        };

        expect(() => updateUserSchema.parse(validData)).not.toThrow();
    });

    it('should fail validation with invalid avatar URL', () => {
        const invalidData = {
            avatar: 'not-a-valid-url',
        };

        expect(() => updateUserSchema.parse(invalidData)).toThrow();
    });

    it('should fail validation with big display name', () => {
        const invalidData = {
            displayName: 'Johnathan Alexander Maximillian Doe',
        };

        expect(() => updateUserSchema.parse(invalidData)).toThrow();
    });
});