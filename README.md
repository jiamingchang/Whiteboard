# Whiteboard

白板在线体验网址：http://182.61.20.203/

演示视频：

源码及架构文档：/docs/白板.md

## 前端

- 运行项目


```js
npm run dev
```

- 打包

```js
npm run build
```

## node 后端

node index.js

## 后端

### 方法一：本地运行

1、下载并安装goland

2、代码下载

```
git clone https://gitee.com/jiamingchang/hm.git
```

3、项目导入

```
打开goland，点击File->Open->代码路径
```

4、打开app.ini

```
更换你自己本地的配置
```

5、开启本地服务

```
点击run按钮
```



### 方法二：使用云服务器部署

1、安装docker、docker-compose、git

```go
apt-get update
apt install docker
apt install docker-compose
apt install git
```

2、项目导入

```go
cd home
git clone https://github.com/jiamingchang/Whiteboard.git
```

3、nginx配置

```go
// 1、将域名证书及私钥文件放入 /home/nginx/ssl
// 2、将配置文件命名为default.conf，放入 /home/nginx/conf.d
```

nginx配置文件示例

```go
server {
    listen       80;
    listen  [::]:80;
    
    # 请更换你的域名
    server_name  xxxx;
    
   	rewrite ^(.*)$  https://$host$1 permanent;
    
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
server {
	listen	443 ssl http2;
	listen	[::]:443 ssl http2;
  
  	# 请更换你的域名
    server_name  xxxx;
	
    # 请更换你的域名证书和私钥文件路径
    ssl_certificate	/etc/nginx/ssl/xxxx;
  	ssl_certificate_key	/etc/nginx/ssl/xxxx;
    

	location / {
		add_header 'Access-Control-Allow-Origin' '*';
    	add_header 'Access-Control-Allow-Methods' 'PUT,POST,GET,DELETE,OPTIONS';
    	add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,token';

    	if ($request_method = 'OPTIONS') {
        	return 204;
    	}

		client_max_body_size 1000m;

		proxy_set_header   Host                 $host;
		proxy_set_header   X-Real-IP            $remote_addr;
		proxy_set_header   X-Forwarded-For      $proxy_add_x_forwarded_for;
		proxy_set_header   X-Forwarded-Proto    $scheme;
       
        proxy_http_version 1.1;       
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        
	    proxy_pass http://mywb:8080/;
    	proxy_buffer_size 32k;
    	proxy_buffers 4 64k;
    	proxy_busy_buffers_size 64k;
    	proxy_connect_timeout 300s;
    	proxy_send_timeout 300s;
    	proxy_read_timeout 300s;
	}
}
```

4、开启服务

```
cd /home/wb
docker-compose up
```

