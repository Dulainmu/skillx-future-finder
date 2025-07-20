import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  Star, 
  Clock, 
  CheckCircle2,
  MessageSquare,
  Download,
  Award
} from 'lucide-react';
import { authApi } from '@/services/authApi';

interface ProjectSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  projectTitle: string;
  description: string;
  skills: string[];
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved';
  fileUrl?: string;
  feedback?: string;
  score?: number;
}

const MentorDashboard = () => {
  const [mentor, setMentor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchMentor = async () => {
      setIsLoading(true);
      try {
        const res = await authApi.getCurrentUser();
        setMentor(res.data.user);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to load mentor profile.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentor();
  }, [toast]);

  useEffect(() => {
    // Mock data for project submissions
    setSubmissions([
      {
        id: '1',
        studentName: 'Alex Chen',
        studentEmail: 'alex.chen@email.com',
        projectTitle: 'Customer Segmentation Analysis',
        description: 'Used K-means clustering to segment customers based on purchasing behavior. Implemented data preprocessing, feature engineering, and visualization.',
        skills: ['Python', 'Pandas', 'K-means', 'Data Visualization'],
        submittedAt: '2024-01-15T10:30:00Z',
        status: 'pending',
        fileUrl: 'project-files/customer-segmentation.zip'
      },
      {
        id: '2',
        studentName: 'Sarah Johnson',
        studentEmail: 'sarah.j@email.com',
        projectTitle: 'Sales Prediction Model',
        description: 'Built a machine learning model using linear regression to predict future sales. Achieved 85% accuracy on test set.',
        skills: ['Python', 'Scikit-learn', 'Linear Regression', 'Feature Engineering'],
        submittedAt: '2024-01-14T14:20:00Z',
        status: 'reviewed',
        fileUrl: 'project-files/sales-prediction.zip',
        feedback: 'Great work on feature engineering! Consider trying other regression models like Random Forest.',
        score: 88
      },
      {
        id: '3',
        studentName: 'Michael Rodriguez',
        studentEmail: 'mike.r@email.com',
        projectTitle: 'Real-time Data Dashboard',
        description: 'Created an interactive dashboard using Streamlit for real-time data monitoring with API integration.',
        skills: ['Python', 'Streamlit', 'APIs', 'Real-time Processing'],
        submittedAt: '2024-01-13T16:45:00Z',
        status: 'approved',
        fileUrl: 'project-files/data-dashboard.zip',
        feedback: 'Excellent implementation! The dashboard is well-designed and the real-time features work perfectly.',
        score: 95
      }
    ]);
  }, []);

  const handleReviewSubmission = (submissionId: string, newFeedback: string, newScore: number) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === submissionId 
        ? { ...submission, status: 'reviewed', feedback: newFeedback, score: newScore }
        : submission
    ));

    toast({
      title: "Review Submitted",
      description: "Student has been notified of your feedback.",
    });

    setSelectedSubmission(null);
    setFeedback('');
    setScore(0);
  };

  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === submissionId 
        ? { ...submission, status: 'approved' }
        : submission
    ));

    toast({
      title: "Project Approved",
      description: "Project has been approved and student notified.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (!mentor) return <div className="text-center mt-8">Mentor not found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Header />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    Mentor Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Review student projects and provide feedback
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
                    <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-yellow-800">{pendingCount}</div>
                    <div className="text-xs text-yellow-600">Pending Review</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                    <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-blue-800">{reviewedCount}</div>
                    <div className="text-xs text-blue-600">Reviewed</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-800">{approvedCount}</div>
                    <div className="text-xs text-green-600">Approved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="submissions">Project Submissions</TabsTrigger>
              <TabsTrigger value="students">Students Overview</TabsTrigger>
            </TabsList>

            {/* Submissions Tab */}
            <TabsContent value="submissions">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Submissions List */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recent Submissions</h2>
                  {submissions.map((submission) => (
                    <Card 
                      key={submission.id} 
                      className={`bg-card/80 backdrop-blur-sm border border-border/50 cursor-pointer transition-all hover:shadow-lg ${
                        selectedSubmission?.id === submission.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-foreground">{submission.projectTitle}</CardTitle>
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          By {submission.studentName} • {formatDate(submission.submittedAt)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {submission.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {submission.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {submission.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{submission.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Review Panel */}
                <div className="space-y-4">
                  {selectedSubmission ? (
                    <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Review Project</span>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download Files
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">{selectedSubmission.projectTitle}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {selectedSubmission.description}
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            <Label className="text-sm font-medium">Student Details</Label>
                            <div className="text-sm">
                              <div>{selectedSubmission.studentName}</div>
                              <div className="text-muted-foreground">{selectedSubmission.studentEmail}</div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <Label className="text-sm font-medium">Skills Demonstrated</Label>
                            <div className="flex flex-wrap gap-1">
                              {selectedSubmission.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {selectedSubmission.status === 'pending' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="score">Score (0-100)</Label>
                              <Input
                                id="score"
                                type="number"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                                placeholder="Enter score"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="feedback">Feedback</Label>
                              <Textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide detailed feedback for the student..."
                                rows={4}
                              />
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleReviewSubmission(selectedSubmission.id, feedback, score)}
                                disabled={!feedback.trim() || score === 0}
                              >
                                Submit Review
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => setSelectedSubmission(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedSubmission.status === 'reviewed' && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Your Review</Label>
                              <div className="mt-2 p-3 bg-muted/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="font-medium">Score: {selectedSubmission.score}/100</span>
                                </div>
                                <p className="text-sm">{selectedSubmission.feedback}</p>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleApproveSubmission(selectedSubmission.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Approve Project
                            </Button>
                          </div>
                        )}

                        {selectedSubmission.status === 'approved' && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 text-green-800">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-medium">Project Approved</span>
                            </div>
                            <p className="text-green-700 text-sm mt-2">
                              This project has been approved and the student has been notified.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
                      <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Select a submission to review
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Active Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">127</div>
                    <p className="text-sm text-muted-foreground">Currently enrolled</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Avg Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">84.2</div>
                    <p className="text-sm text-muted-foreground">Out of 100</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">92%</div>
                    <p className="text-sm text-muted-foreground">Projects completed</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentorDashboard;