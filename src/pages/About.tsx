
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shield, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-page)' }}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            About SalarySync
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
            We're dedicated to simplifying payroll management for Kenyan businesses with accurate, 
            compliant, and user-friendly solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-16">
          <Card className="card-modern p-4 md:p-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Award className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground">
                To empower Kenyan businesses with streamlined payroll processing that ensures 
                compliance with KRA regulations while saving time and reducing errors.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern p-4 md:p-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base text-muted-foreground">
                To be the leading payroll solution in Kenya, trusted by businesses of all sizes 
                for accurate calculations and regulatory compliance.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="card-modern text-center p-4 md:p-6">
            <Users className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Expert Team</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Our team comprises payroll experts and software developers with deep understanding 
              of Kenyan tax regulations.
            </p>
          </Card>

          <Card className="card-modern text-center p-4 md:p-6">
            <Shield className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">KRA Compliant</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              All calculations follow the latest KRA guidelines for PAYE, NSSF, NHIF, 
              and Housing Levy deductions.
            </p>
          </Card>

          <Card className="card-modern text-center p-4 md:p-6">
            <Clock className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">Always Updated</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              We continuously update our system to reflect the latest changes in Kenyan 
              tax laws and regulations.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
