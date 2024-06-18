/* import * as url from 'url' */
import path from 'path'


export  const config = {
    SERVER : 'MongoDB',
    APP_NAME : 'TOMAS_APP',
    PORT: 4000,
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')), // Win
    // UPLOAD_DIR: 'public/img'
    get UPLOAD_DIR() {return `${this.DIRNAME}/public/img`},
    MONGODB_URI : "mongodb+srv://coder_zato:zato1308@clustercoderdb.yr7oapi.mongodb.net/ecommerce",
    // MONGODB_URI2 : "mongodb://127.0.0.1:27017/ecommerce",
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET : "tomas_!#=(",

     /*
    ATENCION!!!: datos como el client_secret de Github NO deben exponerse de esta forma,
    lo estamos haciendo simplemente por comodidad para instrucción, más adelante los
    protegeremos colocándolos en otro lugar.
    */
    GITHUB_CLIENT_ID: 'Iv23liOdMdXUm6BjGHpV',
    GITHUB_CLIENT_SECRET: 'e26c8b963bcf9cd91ed4584e09a3a41fd0bf3fbd',
    GITHUB_CALLBACK_URL: 'http://localhost:4000/api/auth/ghlogincallback'
}










