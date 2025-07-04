
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Users, FileText, DollarSign, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import ClerkAuth from "@/components/auth/ClerkAuth";

const Index = () => {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
          <Navigation />
          
          {/* Hero Section with Geometric Background */}
          <div className="relative overflow-hidden">
            {/* Geometric Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
              <div className="absolute top-60 -left-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="container mx-auto px-4 py-20 relative">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                  <Shield className="h-4 w-4 mr-2" />
                  KRA Compliant & Secure
                </div>
                <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Kenya's Premier
                  <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Payroll Calculator
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Streamline your payroll processing with precision. Calculate PAYE, NSSF, NHIF, and Housing Levy 
                  with complete accuracy and regulatory compliance.
                </p>
              </div>

              <div className="flex justify-center">
                {/* Center the Clerk Auth component */}
                <div className="w-full max-w-md">
                  <ClerkAuth />
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Kenya Payroll Hub?</h2>
                <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {[
                    { icon: Clock, title: "Save Time", description: "Reduce payroll processing from hours to minutes" },
                    { icon: CheckCircle, title: "Error-Free", description: "Eliminate manual calculation errors completely" },
                    { icon: Shield, title: "Stay Compliant", description: "Always up-to-date with KRA regulations" },
                    { icon: DollarSign, title: "Cost Effective", description: "More affordable than hiring payroll specialists" }
                  ].map((benefit, index) => (
                    <div key={index} className="text-center group">
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default Index;
