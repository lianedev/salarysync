
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Clock, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AnalyticsProps {
  employees: any[];
}

const Analytics = ({ employees }: AnalyticsProps) => {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("turnover");

  // Generate mock data for analytics
  const turnoverData = useMemo(() => [
    { month: 'Jan', rate: 5.2, hires: 8, terminations: 3 },
    { month: 'Feb', rate: 4.8, hires: 6, terminations: 2 },
    { month: 'Mar', rate: 6.1, hires: 10, terminations: 4 },
    { month: 'Apr', rate: 3.9, hires: 7, terminations: 2 },
    { month: 'May', rate: 7.2, hires: 5, terminations: 5 },
    { month: 'Jun', rate: 4.5, hires: 9, terminations: 3 }
  ], []);

  const departmentData = useMemo(() => {
    const deptCounts = employees.reduce((acc: any, emp: any) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
    return Object.entries(deptCounts).map(([dept, count], index) => ({
      name: dept,
      value: count,
      fill: colors[index % colors.length]
    }));
  }, [employees]);

  const salaryDistribution = useMemo(() => {
    const ranges = [
      { range: '0-30K', min: 0, max: 30000 },
      { range: '30K-50K', min: 30000, max: 50000 },
      { range: '50K-75K', min: 50000, max: 75000 },
      { range: '75K-100K', min: 75000, max: 100000 },
      { range: '100K+', min: 100000, max: Infinity }
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: employees.filter(emp => emp.basicSalary >= min && emp.basicSalary < max).length
    }));
  }, [employees]);

  const performanceData = [
    { month: 'Jan', avgRating: 4.2, productivity: 85 },
    { month: 'Feb', avgRating: 4.3, productivity: 87 },
    { month: 'Mar', avgRating: 4.1, productivity: 82 },
    { month: 'Apr', avgRating: 4.4, productivity: 89 },
    { month: 'May', avgRating: 4.5, productivity: 91 },
    { month: 'Jun', avgRating: 4.3, productivity: 88 }
  ];

  const predictiveData = [
    { month: 'Jul', predicted: 6.2, confidence: 85 },
    { month: 'Aug', predicted: 5.8, confidence: 82 },
    { month: 'Sep', predicted: 7.1, confidence: 78 },
    { month: 'Oct', predicted: 6.5, confidence: 80 },
    { month: 'Nov', predicted: 5.9, confidence: 83 },
    { month: 'Dec', predicted: 6.8, confidence: 79 }
  ];

  const kpiCards = [
    {
      title: "Current Turnover Rate",
      value: "5.2%",
      change: "-1.3%",
      trend: "down",
      icon: Users
    },
    {
      title: "Avg. Salary",
      value: `KSh ${Math.round(employees.reduce((sum, emp) => sum + emp.basicSalary, 0) / employees.length || 0).toLocaleString()}`,
      change: "+2.5%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Employee Satisfaction",
      value: "4.3/5",
      change: "+0.2",
      trend: "up",
      icon: TrendingUp
    },
    {
      title: "Time to Fill Positions",
      value: "18 days",
      change: "-3 days",
      trend: "down",
      icon: Clock
    }
  ];

  const chartConfig = {
    turnover: { label: "Turnover Rate", color: "#8884d8" },
    hires: { label: "Hires", color: "#82ca9d" },
    terminations: { label: "Terminations", color: "#ff7300" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">Comprehensive workforce analytics and predictive insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className={`text-xs flex items-center ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {kpi.change} from last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="turnover" className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="turnover">Turnover Analysis</TabsTrigger>
          <TabsTrigger value="diversity">Diversity Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="turnover" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Turnover Trends</CardTitle>
                <CardDescription>Monthly turnover rate with hires and terminations</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={turnoverData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hires vs Terminations</CardTitle>
                <CardDescription>Monthly comparison of workforce changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={turnoverData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hires" fill="#82ca9d" name="Hires" />
                    <Bar dataKey="terminations" fill="#ff7300" name="Terminations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>Employee count by salary ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={salaryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Average ratings and productivity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="avgRating" stroke="#8884d8" name="Avg Rating" />
                  <Line yAxisId="right" type="monotone" dataKey="productivity" stroke="#82ca9d" name="Productivity %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workforce Planning Predictions</CardTitle>
              <CardDescription>AI-powered predictions for workforce planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="predicted" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} name="Predicted Turnover %" />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-muted-foreground">Predicted Hiring Need</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-muted-foreground">Model Confidence</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-muted-foreground">Departments at Risk</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
