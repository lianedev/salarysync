
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import PayrollResults from "./PayrollResults";

interface PayrollCalculatorProps {
  employees: any[];
}

const PayrollCalculator = ({ employees }: PayrollCalculatorProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [payrollData, setPayrollData] = useState(null);

  // Kenyan tax calculation functions
  const calculatePAYE = (taxableIncome: number) => {
    let paye = 0;
    
    if (taxableIncome <= 24000) {
      paye = taxableIncome * 0.1;
    } else if (taxableIncome <= 32333) {
      paye = 2400 + (taxableIncome - 24000) * 0.25;
    } else if (taxableIncome <= 500000) {
      paye = 2400 + 2083.25 + (taxableIncome - 32333) * 0.3;
    } else if (taxableIncome <= 800000) {
      paye = 2400 + 2083.25 + 140300.1 + (taxableIncome - 500000) * 0.325;
    } else {
      paye = 2400 + 2083.25 + 140300.1 + 97500 + (taxableIncome - 800000) * 0.35;
    }

    return Math.max(0, paye);
  };

  const calculateNSSF = (pensionablePay: number) => {
    const tier1 = Math.min(pensionablePay, 7000);
    const tier2 = Math.min(Math.max(pensionablePay - 7000, 0), 29000);
    
    return (tier1 * 0.06) + (tier2 * 0.06);
  };

  const calculateNHIF = (grossSalary: number) => {
    if (grossSalary <= 5999) return 150;
    if (grossSalary <= 7999) return 300;
    if (grossSalary <= 11999) return 400;
    if (grossSalary <= 14999) return 500;
    if (grossSalary <= 19999) return 600;
    if (grossSalary <= 24999) return 750;
    if (grossSalary <= 29999) return 850;
    if (grossSalary <= 34999) return 900;
    if (grossSalary <= 39999) return 950;
    if (grossSalary <= 44999) return 1000;
    if (grossSalary <= 49999) return 1100;
    if (grossSalary <= 59999) return 1200;
    if (grossSalary <= 69999) return 1300;
    if (grossSalary <= 79999) return 1400;
    if (grossSalary <= 89999) return 1500;
    if (grossSalary <= 99999) return 1600;
    return 1700;
  };

  const calculateHousingLevy = (grossSalary: number) => {
    return grossSalary * 0.015; // 1.5% housing levy
  };

  const calculatePayroll = () => {
    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) return;

    const basicSalary = employee.basicSalary || 0;
    const houseAllowance = employee.houseAllowance || 0;
    const transportAllowance = employee.transportAllowance || 0;
    const medicalAllowance = employee.medicalAllowance || 0;
    const otherAllowances = employee.otherAllowances || 0;

    const grossSalary = basicSalary + houseAllowance + transportAllowance + medicalAllowance + otherAllowances;
    
    // NSSF calculation
    const nssf = calculateNSSF(basicSalary);
    
    // Taxable income (gross salary minus NSSF and personal relief)
    const personalRelief = 2400; // Monthly personal relief
    const taxableIncome = Math.max(0, grossSalary - nssf - personalRelief);
    
    // PAYE calculation
    const paye = calculatePAYE(taxableIncome + personalRelief) - personalRelief;
    
    // NHIF calculation
    const nhif = calculateNHIF(grossSalary);
    
    // Housing Levy calculation
    const housingLevy = calculateHousingLevy(grossSalary);
    
    // Total deductions
    const totalDeductions = paye + nssf + nhif + housingLevy;
    
    // Net salary
    const netSalary = grossSalary - totalDeductions;

    const results = {
      employee,
      grossSalary,
      basicSalary,
      allowances: {
        house: houseAllowance,
        transport: transportAllowance,
        medical: medicalAllowance,
        other: otherAllowances,
        total: houseAllowance + transportAllowance + medicalAllowance + otherAllowances
      },
      deductions: {
        paye: Math.round(paye),
        nssf: Math.round(nssf),
        nhif: nhif,
        housingLevy: Math.round(housingLevy),
        total: Math.round(totalDeductions)
      },
      netSalary: Math.round(netSalary),
      taxableIncome: Math.round(taxableIncome)
    };

    setPayrollData(results);
  };

  if (employees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll Calculator</CardTitle>
          <CardDescription>
            No employees found. Please add employees first before calculating payroll.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Payroll Calculator
          </CardTitle>
          <CardDescription>
            Calculate PAYE, NSSF, NHIF, and Housing Levy for your employees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Employee
            </label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee to calculate payroll" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Employee Details</h4>
                {(() => {
                  const employee = employees.find(emp => emp.id === selectedEmployee);
                  return employee ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Position:</span>
                        <p className="font-medium">{employee.position}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Department:</span>
                        <p className="font-medium">{employee.department}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Basic Salary:</span>
                        <p className="font-medium">KSh {employee.basicSalary?.toLocaleString()}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              <Button onClick={calculatePayroll} className="w-full">
                Calculate Payroll
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {payrollData && <PayrollResults data={payrollData} />}
    </div>
  );
};

export default PayrollCalculator;
