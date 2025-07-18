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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
      <Header />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/3 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Search className="w-4 h-4" />
                Career Explorer
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-secondary via-secondary to-primary bg-clip-text text-transparent mb-8">
                Explore Career Paths
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Browse our comprehensive database of careers. Find detailed information about 
                <span className="text-foreground font-medium"> roles, skills required, and growth opportunities</span>
              </p>
            </div>

            {/* Enhanced Search and Filter Section */}
            <div className="mb-12">
              <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search careers, skills, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 text-lg bg-background/50 border-2 hover:border-primary/50 focus:border-primary transition-all duration-300"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="h-14 px-4 rounded-xl border-2 border-border bg-background/50 text-foreground hover:border-primary/50 focus:border-primary focus:outline-none transition-all duration-300 min-w-[180px]"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>
                          {industry} Industry
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-muted-foreground text-center">
                    <span className="font-semibold text-foreground">{filteredCareers.length}</span> career{filteredCareers.length !== 1 ? 's' : ''} found
                    {searchTerm && <span> for "<span className="text-primary font-medium">{searchTerm}</span>"</span>}
                    {selectedIndustry && selectedIndustry !== 'All' && <span> in <span className="text-secondary font-medium">{selectedIndustry}</span></span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Career Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCareers.map((career, index) => (
                <Card 
                  key={career.id} 
                  className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-secondary/50 hover:-translate-y-2 bg-card/80 backdrop-blur-sm relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-3 group-hover:text-secondary transition-colors duration-300">
                          {career.title}
                        </CardTitle>
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                          {career.industry}
                        </Badge>
                      </div>
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {career.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 relative z-10">
                    {/* Enhanced Key Metrics */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center text-sm bg-muted/50 p-3 rounded-lg">
                        <DollarSign className="h-5 w-5 mr-3 text-success" />
                        <span className="font-semibold">{career.salaryRange}</span>
                      </div>
                      <div className="flex items-center text-sm bg-muted/50 p-3 rounded-lg">
                        <TrendingUp className="h-5 w-5 mr-3 text-success" />
                        <span className="font-medium">{career.growth} growth rate</span>
                      </div>
                      <div className="flex items-center text-sm bg-muted/50 p-3 rounded-lg">
                        <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                        <span className="font-medium">{career.timeToLearn} to learn</span>
                      </div>
                    </div>

                    {/* Enhanced Skills */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-foreground">Key Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-primary/20 hover:bg-primary/10 transition-colors duration-200">
                            {skill}
                          </Badge>
                        ))}
                        {career.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs border-muted-foreground/20">
                            +{career.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Action Button */}
                    <Button 
                      className="w-full h-12 mt-6 bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 group-hover:scale-105 transition-all duration-300 shadow-lg" 
                      onClick={() => {
                        console.log('Selected career:', career.title);
                      }}
                    >
                      Learn More
                      <Search className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Empty State */}
            {filteredCareers.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">No careers found</h3>
                  <p className="text-muted-foreground mb-8">
                    Try adjusting your search terms or filters to find more careers.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedIndustry('All');
                    }}
                    className="w-full h-12 hover:scale-105 transition-transform duration-200"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BrowseCareers;