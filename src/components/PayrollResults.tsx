import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle } from "lucide-react";

interface PayrollResultsProps {
  data: {
    employee: {
      firstName: string;
      lastName: string;
      employeeId: string;
      position: string;
      department: string;
      email: string;
    };
    basicSalary: number;
    allowances: {
      house: number;
      transport: number;
      medical: number;
      other: number;
      total: number;
    };
    grossSalary: number;
    deductions: {
      paye: number;
      nssf: number;
      shif: number;
      housingLevy: number;
      total: number;
    };
    taxableIncome: number;
    netSalary: number;
  };
}

const PayrollResults = ({ data }: PayrollResultsProps) => {
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const payslipContent = `
      PAYSLIP - ${data.employee.firstName} ${data.employee.lastName}
      Employee ID: ${data.employee.employeeId}
      Position: ${data.employee.position}
      Department: ${data.employee.department}
      Period: ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}

      EARNINGS:
      Basic Salary: KSh ${data.basicSalary.toLocaleString()}
      Allowances: KSh ${data.allowances.total.toLocaleString()}
      Gross Salary: KSh ${data.grossSalary.toLocaleString()}

      DEDUCTIONS:
      PAYE Tax: KSh ${data.deductions.paye.toLocaleString()}
      NSSF Contribution: KSh ${data.deductions.nssf.toLocaleString()}
      SHIF Contribution: KSh ${data.deductions.shif.toLocaleString()}
      Housing Levy: KSh ${data.deductions.housingLevy.toLocaleString()}
      TOTAL DEDUCTIONS: KSh ${data.deductions.total.toLocaleString()}

      NET SALARY: KSh ${data.netSalary.toLocaleString()}
    `;

    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${data.employee.employeeId}-${new Date().getMonth()+1}-${new Date().getFullYear()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header and employee info cards remain the same */}

      {/* Earnings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Basic Salary</span>
              <span className="font-semibold">KSh {data.basicSalary.toLocaleString()}</span>
            </div>
            {/* Allowances display */}
            <hr />
            <div className="flex justify-between text-lg font-bold text-green-600">
              <span>Gross Salary</span>
              <span>KSh {data.grossSalary.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Deductions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>PAYE Tax</span>
              <span className="font-semibold">KSh {data.deductions.paye.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>NSSF Contribution</span>
              <span className="font-semibold">KSh {data.deductions.nssf.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>SHIF Contribution</span>
              <span className="font-semibold">KSh {data.deductions.shif.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Housing Levy (1.5%)</span>
              <span className="font-semibold">KSh {data.deductions.housingLevy.toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold text-red-600">
              <span>Total Deductions</span>
              <span>KSh {data.deductions.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Salary Card */}
      <Card className="border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Net Salary</h3>
            <p className="text-4xl font-bold text-blue-800 dark:text-blue-300">
              KSh {data.netSalary.toLocaleString()}
            </p>
            <Badge variant="secondary" className="mt-2">
              Take Home Pay
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
            <p className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>PAYE calculated on taxable income: KSh {data.taxableIncome.toLocaleString()}</span>
            </p>
            <p className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>Statutory deductions: NSSF (KSh {data.deductions.nssf.toLocaleString()}) + SHIF (KSh {data.deductions.shif.toLocaleString()}) + Housing Levy (KSh {data.deductions.housingLevy.toLocaleString()})</span>
            </p>
            <p className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>Personal relief: KSh 2,400 applied</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollResults;