
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddEmployeeModalProps {
  onAddEmployee: (employeeData: any) => void;
}

const AddEmployeeModal = ({ onAddEmployee }: AddEmployeeModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    position: "",
    department: "",
    basicSalary: "",
    houseAllowance: "",
    transportAllowance: "",
    medicalAllowance: "",
    otherAllowances: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.employeeId || !formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Convert salary fields to numbers
    const employeeData = {
      ...formData,
      basicSalary: parseFloat(formData.basicSalary) || 0,
      houseAllowance: parseFloat(formData.houseAllowance) || 0,
      transportAllowance: parseFloat(formData.transportAllowance) || 0,
      medicalAllowance: parseFloat(formData.medicalAllowance) || 0,
      otherAllowances: parseFloat(formData.otherAllowances) || 0,
    };

    await onAddEmployee(employeeData);
    
    // Reset form and close modal
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      position: "",
      department: "",
      basicSalary: "",
      houseAllowance: "",
      transportAllowance: "",
      medicalAllowance: "",
      otherAllowances: "",
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="p-0.5" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => handleInputChange("employeeId", e.target.value)}
                placeholder="Enter employee ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Enter position"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Enter department"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Salary Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basicSalary">Basic Salary (KSh)</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  step="0.01"
                  value={formData.basicSalary}
                  onChange={(e) => handleInputChange("basicSalary", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="houseAllowance">House Allowance (KSh)</Label>
                <Input
                  id="houseAllowance"
                  type="number"
                  step="0.01"
                  value={formData.houseAllowance}
                  onChange={(e) => handleInputChange("houseAllowance", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transportAllowance">Transport Allowance (KSh)</Label>
                <Input
                  id="transportAllowance"
                  type="number"
                  step="0.01"
                  value={formData.transportAllowance}
                  onChange={(e) => handleInputChange("transportAllowance", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="medicalAllowance">Medical Allowance (KSh)</Label>
                <Input
                  id="medicalAllowance"
                  type="number"
                  step="0.01"
                  value={formData.medicalAllowance}
                  onChange={(e) => handleInputChange("medicalAllowance", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="otherAllowances">Other Allowances (KSh)</Label>
              <Input
                id="otherAllowances"
                type="number"
                step="0.01"
                value={formData.otherAllowances}
                onChange={(e) => handleInputChange("otherAllowances", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Add Employee
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
