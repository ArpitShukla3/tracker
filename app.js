import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = new SocketIOServer(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render('index');
});

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        socket.emit("user-disconnected", socket.id);
        console.log("Client disconnected");
    });
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,...data});
    })
});

server.listen(process.env.PORT||3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});