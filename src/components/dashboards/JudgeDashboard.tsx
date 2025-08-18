'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { mockSubmissions } from '@/lib/mockData';
import { Submission } from '@/contexts/EventContext';
import {
  Star,
  FileText,
  Users,
  Trophy,
  Eye,
  ExternalLink,
  Clock,
  Award,
  BarChart3,
  Filter,
  Search,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

const JudgeDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    presentation: 0,
    impact: 0,
  });
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    reviewed: 0,
    pending: 0,
    averageScore: 0,
  });

  useEffect(() => {
    // Mock data - in real app, fetch submissions assigned to this judge
    setSubmissions(mockSubmissions);
    setStats({
      totalSubmissions: 25,
      reviewed: 18,
      pending: 7,
      averageScore: 8.2,
    });
  }, [user]);

  const handleScoreSubmission = () => {
    if (!activeSubmission) return;
    
    const totalScore = (scores.innovation + scores.technical + scores.presentation + scores.impact) / 4;
    
    // In real app, submit to API
    console.log('Submitting score:', {
      submissionId: activeSubmission.id,
      scores,
      feedback,
      totalScore,
    });
    
    // Reset form
    setScores({ innovation: 0, technical: 0, presentation: 0, impact: 0 });
    setFeedback('');
    setActiveSubmission(null);
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasMyScore = submission.scores?.some(score => score.judgeId === user?.id);
    
    switch (filter) {
      case 'pending':
        return matchesSearch && !hasMyScore;
      case 'reviewed':
        return matchesSearch && hasMyScore;
      default:
        return matchesSearch;
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Judge Dashboard ⚖️
        </h1>
        <p className="text-muted-foreground">
          Review and score competition submissions fairly and transparently.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviewed</p>
                <p className="text-3xl font-bold">{stats.reviewed}</p>
                <p className="text-xs text-green-600">
                  {Math.round((stats.reviewed / stats.totalSubmissions) * 100)}% complete
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <p className="text-xs text-yellow-600">Need review</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{stats.averageScore}</p>
                <p className="text-xs text-purple-600">Out of 10</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Submissions</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Submissions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Submissions ({filteredSubmissions.length})
              </h3>
              
              {filteredSubmissions.map((submission) => {
                const hasMyScore = submission.scores?.some(score => score.judgeId === user?.id);
                const myScore = submission.scores?.find(score => score.judgeId === user?.id);
                
                return (
                  <Card 
                    key={submission.id} 
                    className={`cursor-pointer hover-lift ${
                      activeSubmission?.id === submission.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveSubmission(submission)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{submission.title}</CardTitle>
                          <CardDescription>by {submission.teamName}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {hasMyScore ? (
                            <Badge className="bg-green-100 text-green-800">
                              Reviewed
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                          </span>
                        </div>
                        
                        {myScore && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className={getScoreColor((myScore.innovation + myScore.technical + myScore.presentation + myScore.impact) / 4)}>
                              {((myScore.innovation + myScore.technical + myScore.presentation + myScore.impact) / 4).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Scoring Panel */}
            <div className="sticky top-4">
              {activeSubmission ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Score Submission</CardTitle>
                    <CardDescription>{activeSubmission.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Project Details</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {activeSubmission.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {activeSubmission.githubUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={activeSubmission.githubUrl} target="_blank">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              GitHub
                            </Link>
                          </Button>
                        )}
                        {activeSubmission.liveUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={activeSubmission.liveUrl} target="_blank">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live Demo
                            </Link>
                          </Button>
                        )}
                        {activeSubmission.videoUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={activeSubmission.videoUrl} target="_blank">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Video
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Scoring Criteria</h4>
                      
                      {Object.entries(scores).map(([criterion, score]) => (
                        <div key={criterion} className="space-y-2">
                          <Label className="capitalize">
                            {criterion} ({score}/10)
                          </Label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={score}
                            onChange={(e) => setScores(prev => ({
                              ...prev,
                              [criterion]: parseInt(e.target.value)
                            }))}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Provide detailed feedback for the team..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Score:</span>
                        <span className="text-2xl font-bold">
                          {((scores.innovation + scores.technical + scores.presentation + scores.impact) / 4).toFixed(1)}/10
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleScoreSubmission}
                      className="w-full"
                      disabled={!feedback.trim() || Object.values(scores).every(s => s === 0)}
                    >
                      Submit Score & Feedback
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Select a Submission</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on a submission from the list to start reviewing and scoring.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Live Leaderboard</h2>
            <Button variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              Export Rankings
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Competition Rankings</CardTitle>
              <CardDescription>
                Real-time standings based on judge scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubmissions
                  .filter(s => s.totalScore)
                  .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
                  .map((submission, index) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{submission.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {submission.teamName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {submission.totalScore?.toFixed(1)}/10
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {submission.scores?.length || 0} judge{(submission.scores?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Judging Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>How scores are distributed across criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Innovation', 'Technical', 'Presentation', 'Impact'].map((criterion) => (
                    <div key={criterion} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{criterion}</span>
                        <span className="text-sm text-muted-foreground">8.2 avg</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Judging Progress</CardTitle>
                <CardDescription>Your review completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {Math.round((stats.reviewed / stats.totalSubmissions) * 100)}%
                    </div>
                    <p className="text-muted-foreground">Completion Rate</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{stats.reviewed} / {stats.totalSubmissions}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${(stats.reviewed / stats.totalSubmissions) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JudgeDashboard;
