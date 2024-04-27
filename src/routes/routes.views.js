import { Router } from "express";
import products from "../../productos.json" assert { type: "json" };
const router = Router();

router.get('/', (req, res) => {
    const viewProducts = { products: products };

    res.render('products', viewProducts);
});

export default router;