import { Socket, Server } from 'socket.io';

export const handleMatchEvents = (socket: Socket, io: Server) => {
  // Admin triggers these events to broadcast to all clients in the match room
  
  socket.on('admin_update_score', ({ matchId, homeScore, awayScore, time }) => {
    // In a real app, verify admin privileges before broadcasting
    io.to(`match_${matchId}`).emit('match_updated', { matchId, homeScore, awayScore, time });
  });

  socket.on('admin_goal_scored', ({ matchId, teamId, player, time }) => {
    io.to(`match_${matchId}`).emit('goal_scored', { matchId, teamId, player, time });
  });

  socket.on('admin_card_given', ({ matchId, teamId, player, type, time }) => {
    io.to(`match_${matchId}`).emit('card_given', { matchId, teamId, player, type, time });
  });

  socket.on('admin_substitution', ({ matchId, teamId, playerIn, playerOut, time }) => {
    io.to(`match_${matchId}`).emit('substitution', { matchId, teamId, playerIn, playerOut, time });
  });

  socket.on('admin_match_finished', ({ matchId }) => {
    io.to(`match_${matchId}`).emit('match_finished', { matchId });
  });
};
