/* import * as url from 'url' */
import path from 'path'


export  const config = {
    SERVER : 'MongoDB',
    PORT: 4000,
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')), // Win
    // UPLOAD_DIR: 'public/img'
    get UPLOAD_DIR() {return `${this.DIRNAME}/public/img`},
    MONGODB_URI : "mongodb+srv://coder_zato:zato1308@clustercoderdb.yr7oapi.mongodb.net/ecommerce",
    // MONGODB_URI2 : "mongodb://127.0.0.1:27017/ecommerce",
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/
}










/*     SERVER: 'local',
    PORT: 5050,
    // DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)), // Linux / Mac
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')), // Win
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/coder_53160',
    MONGODB_URI: 'mongodb+srv://coder_zato:zato1308@clustercoderdb.yr7oapi.mongodb.net/ecommerce'
    // MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/
} */