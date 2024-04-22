import z from 'zod'

 const productSchema = z.object({
    id: z.number().int().positive(), // ID como número entero positivo
    title: z.string().min(1).max(100), // Título de longitud entre 1 y 100 caracteres
    description: z.string().max(500).optional(), // Descripción opcional de hasta 500 caracteres
    price: z.number().min(0.01), // Precio entre 0.01 y 1,000,000
    code: z.string().min(3).max(20), // Código de producto de longitud entre 3 y 20 caracteres
    stock: z.number().int().min(0), // Stock como número entero no negativo
    thumbnails: z.array(z.string()).optional().default([]) // Lista de miniaturas, entre 1 y 5 elementos
});

export default function validateProducts(object) {
    if (!object) {
        return { success: false, error: 'No se proporcionó ningún objeto para validar' };
    }

    return productSchema.safeParse(object);
}