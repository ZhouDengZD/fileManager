var http = require('http');

function parseUrl (req) {
    const url = req.url; 
    const [path = '', paramsStr = ''] = url.split('?'); 

    const pairs = paramsStr.split('&');
    const params = {};

    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = value;
    });

    return {
        path,
        params,
    };
}

function add(a,b){
    const sum = +a + +b;
    return sum;
}

var server = http.createServer((req,res) => {
    res.setHeader('content-type', 'text/plain;charset=utf-8');
    
    const { path, params } = parseUrl(req);

    if(path === '/add') {
        const a = params.a;
        const b = params.b;
        if(!a){
            res.end("计算失败, 参数 a 不能为空");
            return;
        }
        if(!b){
            res.end("计算失败, 参数 b 不能为空");
            return;
        }

        if(isNaN(a)){
            res.end("计算失败, 参数 a 错误（必须是数字）");
            return;
        }
        if(isNaN(b)){
            res.end("计算失败, 参数 b 错误（必须是数字）");
            return;
        }
        res.end(`a+b之和为：${add(a,b)}`);
        return;
    }
})
server.listen(3002,'127.0.0.1');


 