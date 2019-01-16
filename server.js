var fs = require("fs")
var url = require("url").URL
require("http").createServer(
	(req,res)=>{
		console.log(req.url)
		let path = new url(req.url, "http://lightfulsaid.com").pathname.split("/")
		function resArgs(path){
			let state = 200
			let contentType = ""
			let content = JSON.parse(fs.readFileSync('router.json').toString())
			for(let i=1;i<path.length;i++){
				content = content[path[i]]
				if(content == undefined){
					state = 404
					content = "content/404.html"
					break
				}
			}

			contentType = (fnex=>{
				if(fnex=="html")
					return "text/html; charset= utf-8"
				else if(fnex=="jpg")
					return "image/jpeg"
				else if(fnex=="png")
					return "image/png"
				else if(fnex=="txt")
					return "text/plain; charset=utf-8"
				else if(fnex=="js")
					return "application/javascript"
				else
					return "text/plain; charset=utf-8"	
			})(content.split(".").pop())
		
			return [state, contentType, content]
		}
		function resPack(state, contentType, content){
			res.writeHead(state, {"Content-Type": contentType})
			fs.readFile(content, (err, data)=>{
				if(err) throw err
				res.write(data)
				res.end()
			})
		}
//
//施工中
//
		var handlePost = require("./handlePost.js")
		
		if(req.method=="POST"){
			let post = []
			req.on("data", chunk=>{
				post.push(chunk)
			})
			req.on("end", ()=>{
				res.writeHead(200, {"Content-Type": "application/JSON"})
				res.write(
					handlePost.respondHTML(Buffer.concat(post).toString())
				)
				res.end()
			//	resPack(200, "application/JSON", post.concat())
			})
		}
		else if(req.url=="/wav"){
			res.writeHead(200, {"Content-Type": "txt/plain; charset=utf-8"})
			res.write(require("./mission/WAVE/wav.js").genPanel("audiocheck.net_sin_1000Hz_-3dBFS_3s.wav").toString())
			res.end()
}
		else{
			resPack(...resArgs(path))
		}
	}).listen(8888)
