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
      // Call the database function to authenticate employee
      const { data, error } = await supabase.rpc('authenticate_employee', {
        emp_id: employeeId,
        emp_password: password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: "Invalid employee ID or password",
          variant: "destructive",
        });
      } else if (data && data.length > 0) {
        const result = data[0];
        const token = result.token;
        const employeeData = typeof result.employee_data === 'string' 
          ? JSON.parse(result.employee_data) 
          : result.employee_data;
        
        // Pass both token and employee data to parent
        onLogin({ token, employee: employeeData });
        toast({
          title: "Login Successful",
          description: `Welcome back, ${employeeData.first_name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid employee ID or password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
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