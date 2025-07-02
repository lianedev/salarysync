
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calculator, Plus } from "lucide-react";

interface DashboardKPICardsProps {
  employees: any[];
  companyName: string;
}

const DashboardKPICards = ({ employees, companyName }: DashboardKPICardsProps) => {
  return (
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
          <div className="text-2xl font-bold">{companyName}</div>
          <p className="text-xs text-muted-foreground">
            Registered company
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKPICards;
