export interface RegisterUserInterface {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    verified?: boolean;
}

export interface PaginationType {
    page: number;
    limit: number;
}

export interface UserEncodedRequestData {
    id: string;
    name: string;
    email: string;
    role: string;
}
export interface UserUpdateData {
    name: string;
}

export interface RequestWithUser<T> {
    user: UserEncodedRequestData;
}
export type UserRole = 'admin' | 'customer';

export interface LoginUserInterface {
    email: string;
    password: string;
}

export type SentLinkType = Pick<LoginUserInterface, 'email'>;

export interface ValidateUserParams {
    id: string;
    token: string;
}

export interface ForgotPasswordParams {
    id: string;
    token: string;
    password: string;
}
