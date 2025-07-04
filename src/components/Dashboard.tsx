
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { useUser, useClerk } from '@clerk/clerk-react';
import EmployeeList from "./EmployeeList";
import PayrollCalculator from "./PayrollCalculator";
import Analytics from "./Analytics";
import AttendanceTracking from "./AttendanceTracking";
import DashboardKPICards from "./dashboard/DashboardKPICards";
import QuickActionsCard from "./dashboard/QuickActionsCard";
import { useEmployees } from "../hooks/useEmployees";
import { transformEmployeeData } from "./dashboard/EmployeeDataTransformer";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  
  const { user } = useUser();
  const { signOut } = useClerk();
  
  // Transform user data for compatibility with existing components
  const transformedUser = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    companyName: user.organizationMemberships?.[0]?.organization?.name || 
                 user.fullName || 
                 user.primaryEmailAddress?.emailAddress?.split('@')[0] || 
                 'Your Company',
    phoneNumber: user.primaryPhoneNumber?.phoneNumber || '',
  } : null;

  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployees(transformedUser);
  const transformedEmployees = transformEmployeeData(employees);

  const handleLogout = () => {
    signOut();
  };

  if (!user || !transformedUser) {
    return null;
  }

  // If Analytics view is active, show it instead of the main dashboard
  if (showAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowAnalytics(false)} variant="outline">
                  ← Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              </div>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-1 py-8">
          <Analytics employees={transformedEmployees} />
        </div>
      </div>
    );
  }

  if (showAttendance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowAttendance(false)} variant="outline">
                  ← Back to Dashboard
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Attendance & Time Tracking</h1>
              </div>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-1 py-8">
          <AttendanceTracking employees={transformedEmployees} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#209CEE]">
                SalarySync
              </h1>
              <p className="text-gray-600">Welcome back {transformedUser.companyName}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-1 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardKPICards 
              employees={transformedEmployees} 
              companyName={transformedUser.companyName} 
            />

            <QuickActionsCard
              onAddEmployee={addEmployee}
              onCalculatePayroll={() => setActiveTab("calculator")}
              onViewAnalytics={() => setShowAnalytics(true)}
              onTrackAttendance={() => setShowAttendance(true)}
            />
          </TabsContent>

          <TabsContent value="employees">
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <p>Loading employees...</p>
                </CardContent>
              </Card>
            ) : (
              <EmployeeList 
                employees={transformedEmployees}
                onUpdateEmployee={updateEmployee}
                onDeleteEmployee={deleteEmployee}
              />
            )}
          </TabsContent>

          <TabsContent value="calculator">
            <PayrollCalculator 
              employees={transformedEmployees} 
              onSwitchToAddEmployee={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
