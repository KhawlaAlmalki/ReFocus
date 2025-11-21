import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, FileCheck, Eye, Filter } from 'lucide-react';

interface Submission {
  id: string;
  gameName: string;
  status: 'Draft' | 'In Review' | 'Changes Requested' | 'Approved';
  submissionDate: string;
  lastUpdated: string;
  reviewerComments: string;
}

const mockSubmissions: Submission[] = [
  {
    id: '1',
    gameName: 'Focus Quest',
    status: 'Approved',
    submissionDate: '2024-01-10',
    lastUpdated: '2024-01-17',
    reviewerComments: 'Great game! Ready to launch.',
  },
  {
    id: '2',
    gameName: 'Zen Garden',
    status: 'In Review',
    submissionDate: '2024-01-16',
    lastUpdated: '2024-01-17',
    reviewerComments: 'Currently being tested.',
  },
  {
    id: '3',
    gameName: 'Memory Match',
    status: 'Changes Requested',
    submissionDate: '2024-01-12',
    lastUpdated: '2024-01-15',
    reviewerComments: 'Please adjust difficulty levels.',
  },
  {
    id: '4',
    gameName: 'Rhythm Runner',
    status: 'Draft',
    submissionDate: '2024-01-14',
    lastUpdated: '2024-01-14',
    reviewerComments: 'Not submitted yet.',
  },
  {
    id: '5',
    gameName: 'Puzzle Master',
    status: 'In Review',
    submissionDate: '2024-01-13',
    lastUpdated: '2024-01-16',
    reviewerComments: 'Reviewing gameplay mechanics.',
  },
];

export default function SubmissionsList() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const filteredSubmissions = submissions
    .filter((sub) => {
      const matchesSearch = sub.gameName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else if (sortBy === 'submitted') {
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Changes Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const approvedCount = submissions.filter((s) => s.status === 'Approved').length;
  const inReviewCount = submissions.filter((s) => s.status === 'In Review').length;
  const changesCount = submissions.filter(
    (s) => s.status === 'Changes Requested'
  ).length;
  const draftCount = submissions.filter((s) => s.status === 'Draft').length;

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-2xl">
                <FileCheck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Submission Tracker
                </h1>
                <p className="text-lg text-muted-foreground">
                  Monitor the status of all your game submissions
                </p>
              </div>
            </div>
            <Link to="/dev/GameEdit">
              <Button className="rounded-full">Submit New Game</Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  APPROVED
                </p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  IN REVIEW
                </p>
                <p className="text-3xl font-bold text-blue-600">{inReviewCount}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  CHANGES NEEDED
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {changesCount}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-border/50 shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-semibold mb-2">
                  DRAFTS
                </p>
                <p className="text-3xl font-bold text-gray-600">{draftCount}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submissions Table */}
        <Card className="rounded-3xl border border-border/50 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-border/50 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-secondary" />
                <h2 className="text-2xl font-bold text-foreground">
                  All Submissions
                </h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredSubmissions.length} total
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search submissions by game name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 rounded-2xl py-2 h-auto"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 rounded-2xl gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Changes Requested">Changes Needed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40 rounded-2xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last Updated</SelectItem>
                  <SelectItem value="submitted">Recently Submitted</SelectItem>
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
                    Submitted
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Last Updated
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Reviewer Comments
                  </TableHead>
                  <TableHead className="text-foreground font-bold py-4 px-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-semibold text-foreground py-4 px-6">
                      {submission.gameName}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 px-6">
                      {submission.submissionDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 px-6">
                      {submission.lastUpdated}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4 px-6">
                      <span className="line-clamp-2">
                        {submission.reviewerComments}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Link to="/dev/game/new">
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

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center">
              <FileCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No submissions found
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
