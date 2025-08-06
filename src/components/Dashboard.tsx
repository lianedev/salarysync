
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import EmployeeList from "./EmployeeList";
import PayrollCalculator from "./PayrollCalculator";
import Analytics from "./Analytics";
import AttendanceTracking from "./AttendanceTracking";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardKPICards from "./dashboard/DashboardKPICards";
import QuickActionsCard from "./dashboard/QuickActionsCard";
import { useEmployees } from "../hooks/useEmployees";
import { transformEmployeeData } from "./dashboard/EmployeeDataTransformer";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  
  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployees(user);
  const transformedEmployees = transformEmployeeData(employees);

  // If Analytics view is active, show it instead of the main dashboard
  if (showAnalytics) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-page)' }}>
        <header className="glass border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowAnalytics(false)} variant="outline" size="sm">
                  ← Back to Dashboard
                </Button>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Analytics</h1>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <Analytics employees={transformedEmployees} />
        </div>
      </div>
    );
  }

  if (showAttendance) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-page)' }}>
        <header className="glass border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowAttendance(false)} variant="outline" size="sm">
                  ← Back to Dashboard
                </Button>
                <h1 className="text-lg md:text-2xl font-bold text-foreground">Attendance & Time Tracking</h1>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6 md:py-8">
          <AttendanceTracking employees={transformedEmployees} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-page)' }}>
      <DashboardHeader user={user} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="employees" className="text-xs md:text-sm">Employees</TabsTrigger>
            <TabsTrigger value="calculator" className="text-xs md:text-sm">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardKPICards 
              employees={transformedEmployees} 
              companyName={user.companyName} 
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
