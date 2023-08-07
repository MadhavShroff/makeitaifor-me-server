"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'https://www.makeitaifor.me',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.use(cookieParser());
    app.use(csurf({ cookie: true }));
    process.env.APP_ENV === 'dev'
        ? await app.listen(8000)
        : await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map