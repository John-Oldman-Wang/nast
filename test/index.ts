import { createServer } from 'http';
import bootstrap, { Module, Controller} from '../src/index'

@Controller('/a')
class A {
    use(ctx: any) {
        console.log(ctx)
        ctx.body = '123'
    }
}

@Controller('/b')
class B {
    use(ctx: any) {
        ctx.body = 'this is b'
    }
}

@Module({
    controllers: [A, B]
})
class App {}


const handle = bootstrap(App)
const server = createServer(function(req, res) {
    handle(req, res)
})

server.listen(8888 ,() => {
    console.log(`server start at http://localhost:8888/`)
})