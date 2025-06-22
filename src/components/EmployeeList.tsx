
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditEmployeeForm from "./EditEmployeeForm";

interface EmployeeListProps {
  employees: any[];
  onUpdateEmployee: (employee: any) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

const EmployeeList = ({ employees, onUpdateEmployee, onDeleteEmployee }: EmployeeListProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedEmployee: any) => {
    onUpdateEmployee(updatedEmployee);
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  if (employees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Employees Found</CardTitle>
          <CardDescription>
            You haven't added any employees yet. Click "Add Employee" to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Employee List ({employees.length})</CardTitle>
          <CardDescription>
            Manage your employees and their details
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {employees.map((employee: any) => (
          <Card key={employee.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{employee.firstName} {employee.lastName}</h3>
                    <Badge variant="secondary">{employee.department}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Employee KRA Pin:</span>
                      <p className="font-medium">{employee.employeeId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Position:</span>
                      <p className="font-medium">{employee.position}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Basic Salary:</span>
                      <p className="font-medium">KSh {employee.basicSalary?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                      </DialogHeader>
                      {selectedEmployee && (
                        <EditEmployeeForm 
                          employee={selectedEmployee}
                          onUpdateEmployee={handleUpdate}
                          onCancel={() => setIsEditDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDeleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
