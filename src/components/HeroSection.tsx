import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Find Your Ideal Career Path with SkillX
            </h1>
            <p className="text-lg sm:text-xl text-foreground mb-8 leading-relaxed">
              Take our 12-question personality quiz to discover careers tailored to you.
            </p>
            <Button 
              variant="success" 
              size="xl" 
              className="group"
              onClick={() => window.location.href = '/quiz'}
            >
              Start Quiz
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative">
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
      </div>
    </section>
  );
};