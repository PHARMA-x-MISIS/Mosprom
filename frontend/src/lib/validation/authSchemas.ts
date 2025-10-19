// src/lib/validation/authSchemas.ts
import { z } from 'zod';

// Схема для экрана входа
export const loginSchema = z.object({
  email: z.string().email('Некорректный формат почты'),
  password: z.string().min(1, 'Пароль не может быть пустым'),
});

// Схема для первого шага регистрации
export const registrationStep1Schema = z.object({
  lastName: z.string().min(1, 'Фамилия обязательна'),
  firstName: z.string().min(1, 'Имя обязательно'),
  patronymic: z.string().optional(), // Отчество не обязательное
});

// Схема для второго шага регистрации
export const registrationStep2Schema = z.object({
    email: z.string().email('Некорректный формат почты'),
    phone: z.string().min(10, 'Некорректный номер телефона'), // Упрощенная проверка
    password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // Поле, где будет отображаться ошибка
  });

// Типы, выведенные из схем. TypeScript - наш друг!
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationStep1FormData = z.infer<typeof registrationStep1Schema>;
export type RegistrationStep2FormData = z.infer<typeof registrationStep2Schema>;