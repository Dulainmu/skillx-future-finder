import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Briefcase, TrendingUp, DollarSign, Clock } from 'lucide-react';

// Sample career data
const careers = [
  {
    id: 1,
    title: "Data Scientist",
    description: "Analyze large datasets to extract insights and build predictive models",
    industry: "Technology",
    salaryRange: "$90,000 - $150,000",
    growth: "22%",
    timeToLearn: "2-4 years",
    skills: ["Python", "Statistics", "Machine Learning", "SQL"],
    tags: ["analytical", "tech", "high-growth"]
  },
  {
    id: 2,
    title: "UX Designer",
    description: "Design user-friendly interfaces and improve user experience",
    industry: "Design",
    salaryRange: "$75,000 - $120,000", 
    growth: "13%",
    timeToLearn: "1-3 years",
    skills: ["Figma", "User Research", "Prototyping", "Design Thinking"],
    tags: ["creative", "user-focused", "collaborative"]
  },
  {
    id: 3,
    title: "Software Engineer",
    description: "Develop and maintain software applications and systems",
    industry: "Technology",
    salaryRange: "$85,000 - $160,000",
    growth: "25%",
    timeToLearn: "2-4 years",
    skills: ["JavaScript", "React", "Node.js", "Git"],
    tags: ["technical", "problem-solving", "high-demand"]
  },
  {
    id: 4,
    title: "Digital Marketing Manager",
    description: "Plan and execute digital marketing campaigns across various channels",
    industry: "Marketing",
    salaryRange: "$60,000 - $100,000",
    growth: "19%",
    timeToLearn: "1-2 years",
    skills: ["SEO", "Google Analytics", "Content Marketing", "Social Media"],
    tags: ["creative", "analytical", "versatile"]
  },
  {
    id: 5,
    title: "Cybersecurity Analyst",
    description: "Protect organizations from cyber threats and security breaches",
    industry: "Technology",
    salaryRange: "$80,000 - $130,000",
    growth: "28%",
    timeToLearn: "2-3 years",
    skills: ["Network Security", "Risk Assessment", "Incident Response", "Compliance"],
    tags: ["security", "analytical", "critical"]
  },
  {
    id: 6,
    title: "Product Manager",
    description: "Guide product development from conception to launch",
    industry: "Business",
    salaryRange: "$95,000 - $170,000",
    growth: "15%",
    timeToLearn: "3-5 years",
    skills: ["Strategy", "Analytics", "Communication", "Agile"],
    tags: ["leadership", "strategic", "cross-functional"]
  }
];

const BrowseCareers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const industries = ["All", "Technology", "Design", "Marketing", "Business", "Healthcare", "Finance"];

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = selectedIndustry === '' || selectedIndustry === 'All' || career.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Explore Career Paths</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive database of careers. Find detailed information about roles, 
              skills required, and growth opportunities to make informed decisions about your future.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search careers, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="h-12 px-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry} Industry
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
              {selectedIndustry && selectedIndustry !== 'All' && ` in ${selectedIndustry}`}
            </p>
          </div>

          {/* Career Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <Card key={career.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {career.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mb-3">
                        {career.industry}
                      </Badge>
                    </div>
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-sm">
                    {career.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-success" />
                      <span className="font-medium">{career.salaryRange}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 mr-2 text-success" />
                      <span>{career.growth} growth rate</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{career.timeToLearn} to learn</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {career.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {career.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{career.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => {
                      // TODO: Navigate to detailed career page or show more info
                      console.log('Selected career:', career.title);
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCareers.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No careers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find more careers.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowseCareers;