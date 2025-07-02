
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart3, Clock } from "lucide-react";
import AddEmployeeModal from "../AddEmployeeModal";

interface QuickActionsCardProps {
  onAddEmployee: (employeeData: any) => void;
  onCalculatePayroll: () => void;
  onViewAnalytics: () => void;
  onTrackAttendance: () => void;
}

const QuickActionsCard = ({ 
  onAddEmployee, 
  onCalculatePayroll, 
  onViewAnalytics, 
  onTrackAttendance 
}: QuickActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks you might want to perform
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <AddEmployeeModal onAddEmployee={onAddEmployee} />
        <Button onClick={onCalculatePayroll} variant="outline" className="flex items-center gap-1">
          <Calculator className="p-0.5" />
          Calculate Payroll
        </Button>
        <Button onClick={onViewAnalytics} variant="outline" className="flex items-center gap-1">
          <BarChart3 className="p-0.5" />
          View Analytics
        </Button>
        <Button onClick={onTrackAttendance} variant="outline" className="flex items-center gap-1">
          <Clock className="p-0.5" />
          Track Attendance
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
