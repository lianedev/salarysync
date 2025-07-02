
// Utility function to transform database employees to match expected format
export const transformEmployeeData = (employees: any[]) => {
  return employees.map((emp: any) => ({
    ...emp,
    firstName: emp.first_name || emp.firstName,
    lastName: emp.last_name || emp.lastName,
    employeeId: emp.employee_id || emp.employeeId,
    phoneNumber: emp.phone_number || emp.phoneNumber,
    basicSalary: parseFloat(String(emp.basic_salary || emp.basicSalary || '0')),
    houseAllowance: parseFloat(String(emp.house_allowance || emp.houseAllowance || '0')),
    transportAllowance: parseFloat(String(emp.transport_allowance || emp.transportAllowance || '0')),
    medicalAllowance: parseFloat(String(emp.medical_allowance || emp.medicalAllowance || '0')),
    otherAllowances: parseFloat(String(emp.other_allowances || emp.otherAllowances || '0')),
  }));
};
