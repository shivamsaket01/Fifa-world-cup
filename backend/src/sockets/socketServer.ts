import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { handleMatchEvents } from './matchEvents';

let io: Server;

export const initSocketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'https://fifa-world-cup-orpin.vercel.app'
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a specific match room
    socket.on('join_match', (matchId: string) => {
      socket.join(`match_${matchId}`);
      console.log(`Socket ${socket.id} joined room match_${matchId}`);
    });

    // Leave a specific match room
    socket.on('leave_match', (matchId: string) => {
      socket.leave(`match_${matchId}`);
      console.log(`Socket ${socket.id} left room match_${matchId}`);
    });

    handleMatchEvents(socket, io);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
