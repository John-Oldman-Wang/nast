import { Module, Controller, create } from '../dist/index';

@Controller('/a')
class A {
    use(ctx: any) {
        ctx.body = 'this is a';
        console.log(ctx);
    }
}

@Controller('/b')
class B {
    use(ctx: any) {
        ctx.body = 'this is b';
    }
}

@Controller()
class Index {
    use(ctx: any, next: any) {
        ctx.body = 'index';
        return next();
    }
}

@Module({
    controllers: [Index, A, B]
})
class App {}

const app = create(App);
// const handle = bootstrap(App);
// const server = createServer(function (req, res) {
//     handle(req, res);
// });

// console.log(app.controllers)

app.listen(8888, () => {
    console.log(`server start at http://localhost:8888/`);
});
