import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useEmployees = (user: any) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData: any) => {
    try {
      console.log('Current user:', user);
      console.log('Employee data being inserted:', employeeData);
      console.log('User ID being used:', user?.id);

      if (!user || !user.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add employees.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('employees')
        .insert([{
          user_id: user.id,
          employee_id: employeeData.employeeId,
          first_name: employeeData.firstName,
          last_name: employeeData.lastName,
          email: employeeData.email,
          phone_number: employeeData.phoneNumber,
          position: employeeData.position,
          department: employeeData.department,
          basic_salary: employeeData.basicSalary,
          house_allowance: employeeData.houseAllowance,
          transport_allowance: employeeData.transportAllowance,
          medical_allowance: employeeData.medicalAllowance,
          other_allowances: employeeData.otherAllowances,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding employee:', error);
        toast({
          title: "Error",
          description: `Failed to add employee: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      const transformedEmployee = {
        ...data,
        firstName: data.first_name,
        lastName: data.last_name,
        employeeId: data.employee_id,
        phoneNumber: data.phone_number,
        basicSalary: parseFloat(String(data.basic_salary || '0')),
        houseAllowance: parseFloat(String(data.house_allowance || '0')),
        transportAllowance: parseFloat(String(data.transport_allowance || '0')),
        medicalAllowance: parseFloat(String(data.medical_allowance || '0')),
        otherAllowances: parseFloat(String(data.other_allowances || '0')),
      };

      setEmployees(prev => [transformedEmployee, ...prev]);
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateEmployee = async (updatedEmployee: any) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          employee_id: updatedEmployee.employeeId,
          first_name: updatedEmployee.firstName,
          last_name: updatedEmployee.lastName,
          email: updatedEmployee.email,
          phone_number: updatedEmployee.phoneNumber,
          position: updatedEmployee.position,
          department: updatedEmployee.department,
          basic_salary: updatedEmployee.basicSalary,
          house_allowance: updatedEmployee.houseAllowance,
          transport_allowance: updatedEmployee.transportAllowance,
          medical_allowance: updatedEmployee.medicalAllowance,
          other_allowances: updatedEmployee.otherAllowances,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedEmployee.id);

      if (error) {
        console.error('Error updating employee:', error);
        toast({
          title: "Error",
          description: "Failed to update employee. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(prev => prev.map((emp: any) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      ));
      toast({
        title: "Success",
        description: "Employee updated successfully!",
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error('Error deleting employee:', error);
        toast({
          title: "Error",
          description: "Failed to delete employee. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(prev => prev.filter((emp: any) => emp.id !== employeeId));
      toast({
        title: "Success",
        description: "Employee deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
