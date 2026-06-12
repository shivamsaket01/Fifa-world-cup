const fs = require('fs');
const path = require('path');

const fileFixes = {
  'src/components/ui/MatchCard.tsx': 'import type { Match } from \'../../types\';',
  'src/components/ui/NewsCard.tsx': 'import type { News } from \'../../types\';',
  'src/components/ui/ScoreBoard.tsx': 'import type { Match } from \'../../types\';',
  'src/components/ui/StandingTable.tsx': 'import type { Standing } from \'../../types\';',
  'src/components/ui/TeamCard.tsx': 'import type { Team } from \'../../types\';',
  'src/pages/dashboard/AdminNews.tsx': 'import type { News } from \'../../types\';',
  'src/pages/LiveScores.tsx': 'import type { Match } from \'../types\';',
  'src/pages/MatchDetails.tsx': 'import type { Match } from \'../types\';',
  'src/pages/News.tsx': 'import type { News as NewsType } from \'../types\';',
  'src/pages/Standings.tsx': 'import type { Standing } from \'../types\';',
  'src/pages/TeamDetails.tsx': 'import type { Team } from \'../types\';',
  'src/pages/Teams.tsx': 'import type { Team } from \'../types\';',
};

for (const [relPath, correctImport] of Object.entries(fileFixes)) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/import type \{\} from '';/g, correctImport);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${relPath}`);
  }
}

// Fix AuthContext.tsx return type
const authContextPath = path.join(__dirname, 'src/context/AuthContext.tsx');
if (fs.existsSync(authContextPath)) {
  let content = fs.readFileSync(authContextPath, 'utf8');
  content = content.replace(/login: \(userData: any\) => Promise<void>;/, 'login: (userData: any) => Promise<any>;');
  fs.writeFileSync(authContextPath, content, 'utf8');
  console.log('Fixed AuthContext.tsx');
}

// Fix Dashboard Trophy unused import
const dashboardPath = path.join(__dirname, 'src/pages/dashboard/Dashboard.tsx');
if (fs.existsSync(dashboardPath)) {
  let content = fs.readFileSync(dashboardPath, 'utf8');
  content = content.replace(/import \{ Users, Trophy, Flag, FileText, Activity \} from 'lucide-react';/, 'import { Users, Flag, FileText, Activity } from \'lucide-react\';');
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log('Fixed Dashboard.tsx Trophy import');
}

// Fix Standings any types
const standingsPath = path.join(__dirname, 'src/pages/Standings.tsx');
if (fs.existsSync(standingsPath)) {
  let content = fs.readFileSync(standingsPath, 'utf8');
  content = content.replace(/\.sort\(\(a, b\) =>/g, '.sort((a: any, b: any) =>');
  fs.writeFileSync(standingsPath, content, 'utf8');
  console.log('Fixed Standings.tsx implicitly any');
}

// Fix ProtectedRoute JSX namespace
const protectedRoutePath = path.join(__dirname, 'src/components/layout/ProtectedRoute.tsx');
if (fs.existsSync(protectedRoutePath)) {
  let content = fs.readFileSync(protectedRoutePath, 'utf8');
  content = content.replace(/import \{ ReactNode \} from 'react';/, 'import React, { ReactNode } from \'react\';');
  fs.writeFileSync(protectedRoutePath, content, 'utf8');
  console.log('Fixed ProtectedRoute.tsx JSX issue');
}
