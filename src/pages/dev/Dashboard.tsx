import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Input } from 'src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table';
import {
  BookOpen,
  Plus,
  Search,
  TrendingUp,
  FileText,
  Clock,
  Eye,
  Edit,
  Settings,
  FileCheck,
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  status: 'Draft' | 'In Review' | 'Approved';
  lastUpdated: string;
  plays7d: number;
}

const mockGames: Game[] = [
  {
    id: '1',
    name: 'Focus Quest',
    status: 'Approved',
    lastUpdated: '2024-01-17',
    plays7d: 1245,
  },
  {
    id: '2',
    name: 'Zen Garden',
    status: 'In Review',
    lastUpdated: '2024-01-16',
    plays7d: 432,
  },
  {
    id: '3',
    name: 'Memory Match',
    status: 'Draft',
    lastUpdated: '2024-01-15',
    plays7d: 0,
  },
  {
    id: '4',
    name: 'Rhythm Runner',
    status: 'Approved',
    lastUpdated: '2024-01-14',
    plays7d: 856,
  },
  {
    id: '5',
    name: 'Puzzle Master',
    status: 'In Review',
    lastUpdated: '2024-01-13',
    plays7d: 234,
  },
];

export default function DeveloperDashboard() {
  const [games, setGames] = useState(mockGames);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredGames = games
    .filter((game) => {
      const matchesSearch = game.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || game.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else {
        return b.plays7d - a.plays7d;
      }
    });

  const totalGames = games.length;
  const drafts = games.filter((g) => g.status === 'Draft').length;
  const inReview = games.filter((g) => g.status === 'In Review').length;
  const approved = games.filter((g) => g.status === 'Approved').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Welcome Banner */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2">
            Welcome, Developer 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your focus mini-games and track performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Games */}
          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Total Games
                  </p>
                  <p className="text-4xl font-bold text-foreground">{totalGames}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drafts */}
          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Drafts
                  </p>
                  <p className="text-4xl font-bold text-foreground">{drafts}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-2xl">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Review */}
          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    In Review
                  </p>
                  <p className="text-4xl font-bold text-foreground">{inReview}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-2xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved */}
          <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                    Approved
                  </p>
                  <p className="text-4xl font-bold text-foreground">{approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-2xl">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Library Section */}
        <div className="rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-border/50 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Game Library</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage and monitor your games
                  </p>
                </div>
              </div>
              <Link to="/dev/GameEdit">
                <Button className="rounded-full gap-2 transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Add New Game
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search games by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 rounded-2xl py-2 h-auto"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 rounded-2xl">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40 rounded-2xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Last Updated</SelectItem>
                  <SelectItem value="plays">Most Played</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Game Name
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Status
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Last Updated
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Plays (7d)
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.map((game) => (
                  <TableRow
                    key={game.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-semibold text-foreground py-4 px-6">
                      {game.name}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className={getStatusColor(game.status)}>
                        {game.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 px-6">
                      {game.lastUpdated}
                    </TableCell>
                    <TableCell className="text-foreground font-semibold py-4 px-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        {game.plays7d}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Link to={`/dev/game/${game.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGames.length === 0 && (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No games found</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dev/games">
            <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
              <CardContent className="p-8 flex flex-col items-start justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-secondary/10 rounded-2xl">
                    <FileCheck className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Submission Tracker
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track game review status and feedback
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dev/analytics">
            <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
              <CardContent className="p-8 flex flex-col items-start justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Analytics</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  View detailed game performance metrics
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dev/settings">
            <Card className="rounded-3xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
              <CardContent className="p-8 flex flex-col items-start justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-muted rounded-2xl">
                    <Settings className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Settings</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your developer profile and preferences
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
