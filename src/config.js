import * as url from 'url'


export  const config = {
    PORT: 4000,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    // UPLOAD_DIR: 'public/img'
    get UPLOAD_DIR() {return `${this.DIRNAME}/public/img`}
}