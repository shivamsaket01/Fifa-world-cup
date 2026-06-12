import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Match } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const GlobalNotificationHandler = () => {
  const previousScores = useRef<Record<string, string>>({});

  useEffect(() => {
    // Request permission once component mounts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const socket = io(SOCKET_URL);

    socket.on('match_update', (match: Match) => {
      // Create a composite score string
      const currentScore = `${match.homeScore}-${match.awayScore}`;
      const prevScore = previousScores.current[match._id];

      // If the score actually changed, fire a notification
      if (prevScore && prevScore !== currentScore) {
        if ('Notification' in window && Notification.permission === 'granted') {
          let message = 'Goal!';
          if (match.status === 'FT') message = 'Full Time!';
          
          new Notification(message, {
            body: `${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.name}`,
            icon: match.homeTeam.logo || '/logo.png',
          });
        }
      }

      // Update ref
      previousScores.current[match._id] = currentScore;
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};
