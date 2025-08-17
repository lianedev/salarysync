import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeLoginFormProps {
  onLogin: (employee: any) => void;
}

const EmployeeLoginForm = ({ onLogin }: EmployeeLoginFormProps) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting employee login for:", employeeId);
      
      // Call the database function to authenticate employee
      const { data, error } = await supabase.rpc('authenticate_employee', {
        emp_id: employeeId,
        emp_password: password
      });

      console.log("Employee login response:", { data, error });

      if (error) {
        console.error("Employee login error:", error);
        toast({
          title: "Login Failed",
          description: "Invalid employee ID or password",
          variant: "destructive",
        });
      } else if (data && data.length > 0) {
        const employeeData = data[0].employee_data;
        const employee = typeof employeeData === 'string' ? JSON.parse(employeeData) : employeeData;
        console.log("Employee login successful:", employee);
        onLogin(employee);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${employee.first_name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid employee ID or password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Unexpected employee login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input
          id="employeeId"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter your employee ID"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login as Employee"}
      </Button>
    </form>
  );
};

export default EmployeeLoginForm;