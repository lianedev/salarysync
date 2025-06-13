
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Users, Calculator } from "lucide-react";
import EmployeeList from "./EmployeeList";
import AddEmployeeForm from "./AddEmployeeForm";
import PayrollCalculator from "./PayrollCalculator";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Load employees from localStorage
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const saveEmployees = (updatedEmployees: any[]) => {
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const addEmployee = (employee: any) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedEmployees = [...employees, newEmployee];
    saveEmployees(updatedEmployees);
  };

  const updateEmployee = (updatedEmployee: any) => {
    const updatedEmployees = employees.map((emp: any) =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    saveEmployees(updatedEmployees);
  };

  const deleteEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter((emp: any) => emp.id !== employeeId);
    saveEmployees(updatedEmployees);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kenya Payroll Calculator
              </h1>
              <p className="text-gray-600">Welcome back, {user.companyName}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="add-employee">Add Employee</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employees.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active employees in your system
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gross Salary</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    KSh {employees.reduce((total: number, emp: any) => total + (emp.basicSalary || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Combined basic salaries
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Company</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.companyName}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered company
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => setActiveTab("add-employee")} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Employee
                </Button>
                <Button onClick={() => setActiveTab("calculator")} variant="outline" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate Payroll
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeList 
              employees={employees}
              onUpdateEmployee={updateEmployee}
              onDeleteEmployee={deleteEmployee}
            />
          </TabsContent>

          <TabsContent value="add-employee">
            <AddEmployeeForm onAddEmployee={addEmployee} />
          </TabsContent>

          <TabsContent value="calculator">
            <PayrollCalculator employees={employees} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
