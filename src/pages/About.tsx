
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, Shield, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Kenya Payroll Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're dedicated to simplifying payroll management for Kenyan businesses with accurate, 
            compliant, and user-friendly solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To empower Kenyan businesses with streamlined payroll processing that ensures 
                compliance with KRA regulations while saving time and reducing errors.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To be the leading payroll solution in Kenya, trusted by businesses of all sizes 
                for accurate calculations and regulatory compliance.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center p-6">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Our team comprises payroll experts and software developers with deep understanding 
              of Kenyan tax regulations.
            </p>
          </Card>

          <Card className="text-center p-6">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">KRA Compliant</h3>
            <p className="text-gray-600">
              All calculations follow the latest KRA guidelines for PAYE, NSSF, NHIF, 
              and Housing Levy deductions.
            </p>
          </Card>

          <Card className="text-center p-6">
            <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Always Updated</h3>
            <p className="text-gray-600">
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
