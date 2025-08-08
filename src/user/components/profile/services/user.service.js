// userService.ts
import api from '../../../../shared/api/axios';
import axios from 'axios';
export const UserService = {
    // Obtener datos públicos básicos de todos los usuarios (completamente público)
    async getPublicUsers() {
        try {
            // Usar una instancia de axios sin interceptores para rutas públicas
            const publicApi = axios.create({
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            const response = await publicApi.get('/users/public');
            return response.data;
        }
        catch (error) {
            console.error('Error fetching public users:', error);
            throw error;
        }
    },
    // Obtener datos públicos básicos de un usuario por ID (completamente público)
    async getPublicUserById(id) {
        try {
            // Usar una instancia de axios sin interceptores para rutas públicas
            const publicApi = axios.create({
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            const response = await publicApi.get(`/users/public/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching public user by ID:', error);
            throw error;
        }
    },
    // Obtener todos los usuarios (requiere permisos administrativos)
    async getUsers() {
        try {
            const response = await api.get('/users');
            return response.data;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    // Obtener un usuario por ID (requiere permisos administrativos)
    async getUserById(id) {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    },
    // Método con fallback automático: SIEMPRE intenta público primero
    async getUserByIdSafe(id) {
        try {
            // CAMBIO: Usar público primero, luego intentar protegido si es necesario
            console.log('🔍 Intentando obtener datos públicos del usuario:', id);
            const publicResponse = await this.getPublicUserById(id);
            console.log('✅ Datos públicos obtenidos correctamente');
            return publicResponse.data;
        }
        catch (publicError) {
            console.log('⚠️ Datos públicos fallaron, intentando con autenticación:', publicError);
            try {
                // Solo si realmente necesitamos datos completos Y tenemos autenticación
                const response = await this.getUserById(id);
                return response.data;
            }
            catch (authError) {
                console.error('❌ Ambos métodos fallaron:', authError);
                // Devolver datos básicos como último recurso
                return {
                    id: id,
                    name: `Usuario ${id}`,
                    username: undefined,
                    displayName: undefined
                };
            }
        }
    },
    // **NUEVO**: Método que garantiza usar solo endpoints públicos
    async getPublicUserByIdOnly(id) {
        try {
            console.log('🔍 Obteniendo SOLO datos públicos del usuario:', id);
            const response = await this.getPublicUserById(id);
            console.log('✅ Datos públicos obtenidos:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error obteniendo datos públicos:', error);
            // Devolver datos básicos como fallback
            return {
                id: id,
                name: `Usuario ${id}`,
                username: undefined,
                displayName: undefined
            };
        }
    },
    // Obtener detalles de seguridad de un usuario (requiere autenticación y permisos)
    async getUserSecurityDetails(id) {
        try {
            const response = await api.get(`/users/${id}/security`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching security details:', error);
            throw error;
        }
    },
    // Actualizar un usuario (requiere autenticación y permisos)
    async updateUser(id, data) {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
    // Eliminar un usuario (requiere autenticación y permisos)
    async deleteUser(id) {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
    // Helper para obtener el nombre de usuario de forma segura
    getUserDisplayName(user) {
        return user.displayName || user.name || user.username || 'Usuario desconocido';
    },
    // Helper para verificar si es un usuario completo (con email)
    isFullUser(user) {
        return 'email' in user;
    }
};
