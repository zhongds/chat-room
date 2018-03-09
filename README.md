## chat-room
聊天室， websocket demo

## 技术点
- koa
- koa-static
- koa-router
- socket

## 主要功能
- 分房间聊天（已完成）
- 创建频道、创建房间
- 频道广播
- 私聊(部分完成)

## 启动项目
```
git clone https://github.com/zhongds/chat-room.git
cd chat-room
npm start
```
默认启动3001端口，如果需要更改端口，可以修改package.json文件, 如下：
```
// package.json

"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "set PORT=3000 && node server/index.js"
}
```
