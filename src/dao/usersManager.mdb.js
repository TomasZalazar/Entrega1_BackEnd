
import mongoose from 'mongoose';
import { config } from '../config.js';

class UserManager {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        try {
            const users = await this.model.find().lean();
            return { origin: config.SERVER, status: 200, payload: users };
        } catch (error) {
            console.error("Error en la consulta:", error);
            return { status: 500, error: "Error al obtener usuarios" };
        }
    }
    async getOne(filter) {
        try {
            return await this.model.findOne(filter).lean();
        } catch (err) {
            return err.message;
        };
    };
    async getById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return { status: 400, error: 'Invalid ID format' };
            }
            const user = await this.model.findById(id).lean();
            if (user) {
                return { origin: config.SERVER, status: 200, payload: user };
            } else {
                return { status: 404, error: 'User not found' };
            }
        } catch (error) {
            console.error("Error en la consulta:", error);
            return { status: 500, error: error.message };
        }
    }

    async add(userData) {
        try {
            // Verificar si userData está definido y es un objeto
            if (!userData || typeof userData !== 'object') {
                throw new Error('Los datos del usuario son inválidos');
            }
    
            // Crear una instancia del modelo de usuario con los datos proporcionados
            const newUser = new this.model(userData);
    
            // Guardar el nuevo usuario en la base de datos
            const savedUser = await newUser.save();
    
            // Verificar si se guardó correctamente el usuario
            if (!savedUser) {
                throw new Error('No se pudo guardar el usuario en la base de datos');
            }
    
            // Devolver el nuevo usuario guardado en un objeto de respuesta
            return { origin: config.SERVER, status: 201, payload: savedUser };
        } catch (error) {
            // Capturar y manejar cualquier error que ocurra durante el proceso
            console.error("Error al agregar usuario:", error);
            return { status: 500, error: error.message };
        }
    }

    async update(id, updatedData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return { status: 400, error: 'Invalid ID format' };
            }
            const updatedUser = await this.model.findByIdAndUpdate(id, updatedData, { new: true }).lean();
            if (updatedUser) {
                return { origin: config.SERVER, status: 200, payload: updatedUser };
            } else {
                return { status: 404, error: 'User not found' };
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return { status: 500, error: error.message };
        }
    }

    async delete(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return { status: 400, error: 'Invalid ID format' };
            }
            const deletedUser = await this.model.findByIdAndDelete(id).lean();
            if (deletedUser) {
                return { origin: config.SERVER, status: 200, payload: deletedUser };
            } else {
                return { status: 404, error: 'User not found' };
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return { status: 500, error: error.message };
        }
    }
    async getAggregated(match, sort)  {
        try {
            return await this.model.aggregate([
                { $match: match },
                // { $group: group },
                { $sort: sort }
            ]);
        } catch (err) {
            return err.message;
        };
    };

    async getPaginated(filter, options) {
        try {
            return await usersModel.paginate(filter, options);
        } catch (err) {
            return err.message;
        };
    };
}

export default UserManager;
