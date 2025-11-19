import { createContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "@/lib/api";
import type { UserDto } from "@/lib/api";

interface AuthContextType{
    user: UserDto | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<UserDto>;
    logout: () => Promise<void>;
    hasRole: (role: string | string[]) => boolean;
    refreshUser: () => Promise<void>;
}

export const AutContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await apiClient.auth.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<UserDto> => {
        const userData = await apiClient.auth.login({ email, password });
        setUser(userData);
        return userData;
    };

    const logout = async (): Promise<void> => {
        try {
            await apiClient.auth.logout();
        }finally {
            setUser(null);
        }
    };

    const hasRole = (role: string | string[]): boolean => {
        if (!user || !user.roles) return false;

        const allowedRoles = Array.isArray(role) ? role : [role];
        return user.roles.some(role => allowedRoles.includes(role));
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        refreshUser,
    };
    
    return (
        <AutContext.Provider value={value}>
            {children}
        </AutContext.Provider>
    );
}