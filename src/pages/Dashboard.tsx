import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Upload, FileSpreadsheet, Plus, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const stats = [
    {
      title: "Total Products",
      value: "2,847",
      change: "+12%",
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Total Value",
      value: "$5.2M",
      change: "+18%",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Active Suppliers",
      value: "156",
      change: "+5%",
      icon: Users,
      color: "text-warning"
    },
    {
      title: "This Month",
      value: "342",
      change: "+23%",
      icon: TrendingUp,
      color: "text-primary"
    }
  ]

  const quickActions = [
    {
      title: "Upload Inventory",
      description: "Upload Excel files with multiple products",
      icon: Upload,
      action: () => navigate('/upload'),
      variant: "brand" as const
    },
    {
      title: "Excel Manager",
      description: "Manage inventory with spreadsheet interface",
      icon: FileSpreadsheet,
      action: () => navigate('/excel'),
      variant: "secondary" as const
    },
    {
      title: "Add Single Product",
      description: "Add individual diamond to inventory",
      icon: Plus,
      action: () => navigate('/add'),
      variant: "outline" as const
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your LabNetXL inventory management system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-primary opacity-5 rounded-full -mr-8 -mt-8" />
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="p-4 border border-border rounded-lg hover:shadow-soft transition-all hover:border-primary/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">{action.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {action.description}
                </p>
                <Button 
                  onClick={action.action}
                  variant={action.variant}
                  size="sm"
                  className="w-full"
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Uploaded inventory file", details: "diamonds_batch_001.xlsx", time: "2 hours ago", type: "upload" },
              { action: "Added new product", details: "Emerald 4.42ct F VS2", time: "4 hours ago", type: "add" },
              { action: "Updated pricing", details: "Bulk update for 125 products", time: "1 day ago", type: "update" },
              { action: "Exported inventory", details: "Full catalog export", time: "2 days ago", type: "export" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'upload' ? 'bg-primary/10' :
                  activity.type === 'add' ? 'bg-success/10' :
                  activity.type === 'update' ? 'bg-warning/10' :
                  'bg-secondary'
                }`}>
                  {activity.type === 'upload' && <Upload className="w-4 h-4 text-primary" />}
                  {activity.type === 'add' && <Plus className="w-4 h-4 text-success" />}
                  {activity.type === 'update' && <TrendingUp className="w-4 h-4 text-warning" />}
                  {activity.type === 'export' && <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard