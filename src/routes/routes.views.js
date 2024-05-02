import { Router } from "express";
import products from "../../productos.json" assert { type: "json" };
const router = Router();

router.get('/home', (req, res) => {
    const viewProducts = { products: products };

    res.render('home', viewProducts);
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: products });
    
});
export default router;