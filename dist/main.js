"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const common_1 = require("@nestjs/common");
const nestjs_spelunker_1 = require("nestjs-spelunker");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const tree = nestjs_spelunker_1.SpelunkerModule.explore(app);
    const root = nestjs_spelunker_1.SpelunkerModule.graph(tree);
    const edges = nestjs_spelunker_1.SpelunkerModule.findGraphEdges(root);
    const mermaidEdges = edges
        .map(({ from, to }) => `${from.module.name}-->${to.module.name}`);
    console.log(`graph TD\n\t${mermaidEdges.join('\n\t')}`);
    const adjacencyList = {};
    mermaidEdges.forEach((edge) => {
        const [from, to] = edge.split('-->');
        if (!adjacencyList[from]) {
            adjacencyList[from] = [];
        }
        adjacencyList[from].push(to);
    });
    const visited = {};
    Object.keys(adjacencyList).forEach((node) => {
        visited[node] = 0;
    });
    const hasCycle = async (u, G) => {
        visited[u] = 2;
        for (const v of G[u] || []) {
            if (visited[v] === 2) {
                return true;
            }
            if (visited[v] === 0 && (await hasCycle(v, G))) {
                return true;
            }
        }
        visited[u] = 1;
        return false;
    };
    let cycleDetected = false;
    for (const node in adjacencyList) {
        if (visited[node] === 0) {
            if (await hasCycle(node, adjacencyList)) {
                cycleDetected = true;
                console.log('Cycle detected:', cycleDetected, node);
                break;
            }
        }
    }
    app.enableCors({
        origin: ['https://www.makeitaifor.me', 'http://localhost:3001'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.use(cookieParser());
    app.use(csurf({ cookie: true }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map