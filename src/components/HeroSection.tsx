import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, Search, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Welcome to SkillX
          </h1>
          <p className="text-lg sm:text-xl text-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Discover your ideal career path through our AI-powered platform. Choose how you'd like to begin your journey.
          </p>
        </div>

        {/* Two Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Option 1: Take Quiz */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50" 
                onClick={() => navigate('/quiz')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Take Personality Quiz</CardTitle>
              <CardDescription className="text-base">
                Answer 12 questions designed by career experts to discover careers that match your personality
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 mr-2 text-success" />
                  <span>AI-powered personality analysis</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="w-4 h-4 mr-2 text-success" />
                  <span>Personalized career recommendations</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-success" />
                  <span>Detailed career roadmaps</span>
                </div>
              </div>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full group-hover:translate-y-0 transition-transform"
              >
                Start Quiz
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Option 2: Manual Selection */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-secondary/50" 
                onClick={() => navigate('/browse-careers')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Search className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Browse Career Paths</CardTitle>
              <CardDescription className="text-base">
                Explore our comprehensive database of careers and choose the ones that interest you most
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Search className="w-4 h-4 mr-2 text-secondary" />
                  <span>Browse 100+ career options</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Target className="w-4 h-4 mr-2 text-secondary" />
                  <span>Filter by industry & interests</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary" />
                  <span>Get detailed career information</span>
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full group-hover:translate-y-0 transition-transform"
              >
                Explore Careers
                <Search className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-card">
            <img
              src={heroImage}
              alt="Career guidance illustration"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        </div>
      </div>
    </section>
  );
};