
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AddEmployeeFormProps {
  onAddEmployee: (employee: any) => void;
}

const AddEmployeeForm = ({ onAddEmployee }: AddEmployeeFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    position: "",
    department: "",
    basicSalary: "",
    houseAllowance: "",
    transportAllowance: "",
    medicalAllowance: "",
    otherAllowances: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = {
      ...formData,
      basicSalary: parseFloat(formData.basicSalary) || 0,
      houseAllowance: parseFloat(formData.houseAllowance) || 0,
      transportAllowance: parseFloat(formData.transportAllowance) || 0,
      medicalAllowance: parseFloat(formData.medicalAllowance) || 0,
      otherAllowances: parseFloat(formData.otherAllowances) || 0,
      password: formData.password || 'temp123',
    };

    onAddEmployee(employee);
    toast({
      title: "Employee Added",
      description: `${formData.firstName} ${formData.lastName} has been added successfully.`,
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      employeeId: "",
      email: "",
      phoneNumber: "",
      position: "",
      department: "",
      basicSalary: "",
      houseAllowance: "",
      transportAllowance: "",
      medicalAllowance: "",
      otherAllowances: "",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
        <CardDescription>
          Enter the employee details to add them to your payroll system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Enter Employee id"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Employee Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter employee password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Job Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Enter job position"
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="IT">Information Technology</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Salary & Allowances (KSh)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  name="basicSalary"
                  type="number"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  placeholder="Enter basic salary"
                  required
                />
              </div>
              <div>
                <Label htmlFor="houseAllowance">House Allowance</Label>
                <Input
                  id="houseAllowance"
                  name="houseAllowance"
                  type="number"
                  value={formData.houseAllowance}
                  onChange={handleChange}
                  placeholder="Enter house allowance"
                />
              </div>
              <div>
                <Label htmlFor="transportAllowance">Transport Allowance</Label>
                <Input
                  id="transportAllowance"
                  name="transportAllowance"
                  type="number"
                  value={formData.transportAllowance}
                  onChange={handleChange}
                  placeholder="Enter transport allowance"
                />
              </div>
              <div>
                <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                <Input
                  id="medicalAllowance"
                  name="medicalAllowance"
                  type="number"
                  value={formData.medicalAllowance}
                  onChange={handleChange}
                  placeholder="Enter medical allowance"
                />
              </div>
              <div>
                <Label htmlFor="otherAllowances">Other Allowances</Label>
                <Input
                  id="otherAllowances"
                  name="otherAllowances"
                  type="number"
                  value={formData.otherAllowances}
                  onChange={handleChange}
                  placeholder="Enter other allowances"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Employee
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
