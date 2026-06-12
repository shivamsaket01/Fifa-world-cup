import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  public socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to real-time server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from real-time server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit('join_match', matchId);
    }
  }

  leaveMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit('leave_match', matchId);
    }
  }
}

export const socketService = new SocketService();
