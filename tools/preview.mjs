import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const args=process.argv.slice(2), port=Number(args[args.indexOf('--port')+1])||4173;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 if(pathname==='/__mobile'){
 const query=new URL(req.url,'http://localhost').searchParams;
 const width=Math.max(320,Math.min(520,Number(query.get('width'))||390));
 const height=Math.max(568,Math.min(1000,Number(query.get('height'))||844));
 res.setHeader('Content-Type','text/html; charset=utf-8');
 res.end(`<!doctype html><meta charset="utf-8"><title>KiDO mobile QA ${width} × ${height}</title><style>body{margin:0;background:#101010}iframe{border:0;width:${width}px;height:${height}px;display:block}</style><iframe src="/" title="KiDO mobile viewport"></iframe>`);return;
 }
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(403).end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(data)});
}).listen(port,'0.0.0.0');
