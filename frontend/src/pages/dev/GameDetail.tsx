import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Edit,
  Download,
} from 'lucide-react';

interface SubmissionStep {
  id: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  title: string;
  description: string;
  date?: string;
}

interface Submission {
  id: string;
  gameName: string;
  status: 'Draft' | 'In Review' | 'Changes Requested' | 'Approved';
  currentStep: number;
  submissionDate: string;
  lastUpdated: string;
  reviewerNotes: string;
  steps: SubmissionStep[];
}

const mockSubmission: Submission = {
  id: '2',
  gameName: 'Zen Garden',
  status: 'In Review',
  currentStep: 2,
  submissionDate: '2024-01-16',
  lastUpdated: '2024-01-17',
  reviewerNotes:
    'Your game is currently under review. We are testing the gameplay mechanics and user interface. We will provide detailed feedback within 3-5 business days.',
  steps: [
    {
      id: 1,
      status: 'Completed',
      title: 'Draft Submitted',
      description: 'You submitted the initial game build',
      date: '2024-01-16',
    },
    {
      id: 2,
      status: 'In Progress',
      title: 'In Review',
      description: 'Our team is testing and evaluating your game',
      date: '2024-01-17',
    },
    {
      id: 3,
      status: 'Pending',
      title: 'Changes Requested',
      description: 'We may request changes to improve the game',
    },
    {
      id: 4,
      status: 'Pending',
      title: 'Approved',
      description: 'Your game is approved and ready to launch',
    },
  ],
};

export default function SubmissionTracker() {
  const { id } = useParams();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'In Progress':
        return <Clock className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'Pending':
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  };

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

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'border-green-600';
      case 'In Progress':
        return 'border-blue-600';
      case 'Pending':
        return 'border-gray-300';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dev/dashboard">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {mockSubmission.gameName}
              </h1>
              <p className="text-muted-foreground">Submission Status</p>
            </div>
          </div>
          <Badge className={getStatusColor(mockSubmission.status)}>
            {mockSubmission.status}
          </Badge>
        </div>

        {/* Status Overview Banner */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8 bg-gradient-to-br from-blue-50 to-transparent">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Current Status
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {mockSubmission.status}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Submitted on {mockSubmission.submissionDate} • Last updated{' '}
                  {mockSubmission.lastUpdated}
                </p>
                <div className="bg-white/50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-foreground mb-1">
                        Reviewer Notes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mockSubmission.reviewerNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Stepper */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Submission Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {mockSubmission.steps.map((step, index) => (
                <div key={step.id} className="flex gap-6">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center gap-0">
                    <div
                      className={`w-12 h-12 rounded-full border-2 ${getStatusBorderColor(step.status)} flex items-center justify-center bg-white`}
                    >
                      {getStatusIcon(step.status)}
                    </div>
                    {index < mockSubmission.steps.length - 1 && (
                      <div
                        className={`w-1 h-12 mt-2 ${
                          ['Completed', 'In Progress'].includes(step.status)
                            ? 'bg-green-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-2 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      {step.date && (
                        <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-full px-3 py-1">
                          {step.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submission Details Card */}
        <Card className="rounded-3xl border border-border/50 shadow-sm mb-8">
          <CardHeader className="border-b border-border/50">
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Submission Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Game Title
                </p>
                <p className="text-lg font-bold text-foreground">
                  {mockSubmission.gameName}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Current Status
                </p>
                <Badge className={getStatusColor(mockSubmission.status)}>
                  {mockSubmission.status}
                </Badge>
              </div>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Submitted Date
                </p>
                <p className="text-lg font-bold text-foreground">
                  {mockSubmission.submissionDate}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Last Updated
                </p>
                <p className="text-lg font-bold text-foreground">
                  {mockSubmission.lastUpdated}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-border/50 flex flex-col md:flex-row gap-4">
              <Link to={`/dev/game/${mockSubmission.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-full gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Game
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 rounded-full gap-2"
              >
                <Download className="w-4 h-4" />
                Download Build
              </Button>
              <Link to="/dev/dashboard" className="flex-1">
                <Button className="w-full rounded-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="rounded-3xl border border-border/50 shadow-sm bg-amber-50 border-amber-200">
          <CardContent className="p-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Need Help?</h3>
                <p className="text-sm text-amber-800 mb-4">
                  If you have questions about your submission or need to make
                  changes, you can edit your game details or contact our support
                  team.
                </p>
                <Button variant="outline" className="rounded-full text-amber-900 border-amber-300">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
