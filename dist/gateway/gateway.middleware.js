"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsAuthenticationMiddleware = void 0;
class WsAuthenticationMiddleware {
    constructor(jwtAuthService) {
        this.jwtAuthService = jwtAuthService;
    }
    use(req, res, next) {
        const server = req.app.get('io');
        server.use((socket, next) => {
            if (socket.handshake.query && socket.handshake.query.token) {
                const token = socket.handshake.query.token;
                try {
                    this.jwtAuthService.verifyToken(token);
                    next();
                }
                catch (err) {
                    next(new Error('Authentication error'));
                }
            }
            else {
                next(new Error('Authentication error'));
            }
        });
        next();
    }
}
exports.WsAuthenticationMiddleware = WsAuthenticationMiddleware;
//# sourceMappingURL=gateway.middleware.js.map