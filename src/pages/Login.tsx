import { useState } from "react";
import { Shield, Eye, EyeOff, User, Car, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-northeast.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(identifier, password, selectedRole);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the NE Safety System",
        });
        
        // Navigate based on user type
        switch (selectedRole) {
          case "tourist":
            navigate("/dashboard");
            break;
          case "police":
            navigate("/police");
            break;
          case "transport":
            navigate("/transport");
            break;
          case "superadmin":
            navigate("/superadmin");
            break;
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your ID and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { id: "tourist", label: "Tourist", icon: Shield, description: "Access your travel dashboard" },
    { id: "police", label: "Police", icon: Shield, description: "Monitor incidents and emergencies" },
    { id: "transport", label: "Transport", icon: Car, description: "Manage transport permits" },
    { id: "superadmin", label: "Superadmin", icon: UserCog, description: "Full system administration" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="flex items-center justify-center space-x-2 mb-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold bg-gradient-cultural bg-clip-text text-transparent">
              NE Tourist Safety
            </span>
          </div>
        </div>

        {/* Role Selection */}
        <Card className="bg-white shadow-lg border-0 mb-6">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Select Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? "default" : "outline"}
                  className={`h-12 text-sm font-medium transition-all duration-200 ${
                    selectedRole === role.id 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        {selectedRole && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  {roleOptions.find(r => r.id === selectedRole)?.label} Login
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {roleOptions.find(r => r.id === selectedRole)?.description}
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* ID Field */}
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    {selectedRole === "tourist" ? "Blockchain ID" : "ID"}
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={selectedRole === "tourist" ? "Enter your blockchain id (e.g., 12345)" : "Enter your ID"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {selectedRole === "tourist" ? "Last 4 digits of Aadhaar/Passport" : "Password"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={selectedRole === "tourist" ? "Enter last 4 digits" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                      maxLength={selectedRole === "tourist" ? 4 : undefined}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {selectedRole === "tourist" && (
                    <p className="text-xs text-gray-500">
                      Enter the last 4 digits of your Aadhaar card or Passport number
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-base"
                  disabled={!identifier || !password || isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Tourist:</strong> ID: 12345, Last 4 digits: 1234</div>
                  <div><strong>Police:</strong> ID: police001, Password: demo123</div>
                  <div><strong>Transport:</strong> ID: transport001, Password: demo123</div>
                  <div><strong>Super Admin:</strong> ID: superadmin, Password: demo123</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button 
                  type="button"
                  variant="link" 
                  className="text-emerald-600 hover:text-emerald-700"
                  onClick={() => setSelectedRole("")}
                >
                  ← Change Role
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Register Option */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Don't have an account?</p>
          <Button 
            variant="link" 
            className="text-emerald-600 hover:text-emerald-700"
            onClick={() => navigate("/register")}
          >
            Register Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;