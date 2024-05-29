
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
            const newUser = new this.model(userData);
            await newUser.save();
            return { origin: config.SERVER, status: 201, payload: newUser };
        } catch (error) {
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
}

export default UserManager;
