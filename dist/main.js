"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['https://www.makeitaifor.me', 'http://localhost:3001'],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    });
    app.use(cookieParser());
    app.use((req, res, next) => {
        console.log('Cookies: ', req.cookies);
        console.log('CSRF Token:', req.cookies._csrf);
        next();
    });
    app.use(csurf({
        cookie: true,
        value: (req) => {
            console.log('CSRF Token:', req.cookies._csrf);
            return req.cookies._csrf;
        },
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map