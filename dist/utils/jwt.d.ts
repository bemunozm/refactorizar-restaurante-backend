type UserPayload = {
    id: string;
    sessionId?: string;
    tableId?: string;
    role: 'Invitado' | 'Usuario';
};
export declare const generateJWT: (payload: UserPayload) => any;
export {};
