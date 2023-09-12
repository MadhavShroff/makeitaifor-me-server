import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { SpelunkerModule } from 'nestjs-spelunker';

async function bootstrap() {
  const app: NestExpressApplication = (await NestFactory.create(
    AppModule,
  )) as NestExpressApplication;
  // 1. Generate the tree as text
  // const tree = SpelunkerModule.explore(app);
  // const root = SpelunkerModule.graph(tree);
  // const edges = SpelunkerModule.findGraphEdges(root);
  // const mermaidEdges = edges
  //   // .filter(
  //   //   // I'm just filtering some extra Modules out
  //   //   ({ from, to }) =>
  //   //     !(
  //   //       from.module.name === 'ConfigHostModule' ||
  //   //       from.module.name === 'LoggerModule' ||
  //   //       to.module.name === 'ConfigHostModule' ||
  //   //       to.module.name === 'LoggerModule'
  //   //     ),
  //   // )
  //   .map(({ from, to }) => `${from.module.name}-->${to.module.name}`);
  // console.log(`graph TD\n\t${mermaidEdges.join('\n\t')}`);
  // type Graph = { [key: string]: string[] };

  // // Create adjacency list
  // const adjacencyList: Graph = {};
  // mermaidEdges.forEach((edge) => {
  //   const [from, to] = edge.split('-->');
  //   if (!adjacencyList[from]) {
  //     adjacencyList[from] = [];
  //   }
  //   adjacencyList[from].push(to);
  // });

  // // DFS to check for cycles
  // const visited: { [key: string]: number } = {};

  // // Initialize visited dictionary with zeros
  // Object.keys(adjacencyList).forEach((node) => {
  //   visited[node] = 0;
  // });

  // // DFS function remains the same
  // const hasCycle = async (u: string, G: Graph): Promise<boolean> => {
  //   visited[u] = 2;
  //   for (const v of G[u] || []) {
  //     if (visited[v] === 2) {
  //       return true;
  //     }
  //     if (visited[v] === 0 && (await hasCycle(v, G))) {
  //       return true;
  //     }
  //   }
  //   visited[u] = 1;
  //   return false;
  // };

  // // Run DFS asynchronously
  // let cycleDetected = false;
  // for (const node in adjacencyList) {
  //   if (visited[node] === 0) {
  //     if (await hasCycle(node, adjacencyList)) {
  //       cycleDetected = true;
  //       console.log('Cycle detected:', cycleDetected, node);
  //       break;
  //     }
  //   }
  // }

  // 2. Copy and paste the log content in "https://mermaid.live/"
  app.enableCors({
    origin: ['https://www.makeitaifor.me', 'http://localhost:3001'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useBodyParser('json', { limit: '10mb' });
  // middleware to print the request body
  app.use((req, res, next) => {
    console.log('Request body:', req.body);
    next();
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
