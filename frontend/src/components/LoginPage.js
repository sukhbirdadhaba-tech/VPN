import React from 'react';
import { Shield, Zap, Globe, Lock, Users, BarChart3 } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const features = [
    {
      icon: Globe,
      title: "Global Server Network",
      description: "Connect to high-speed servers across multiple countries and regions"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Military-grade encryption and secure tunneling protocols"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized servers for maximum speed and minimum latency"
    },
    {
      icon: Users,
      title: "Multi-User Management",
      description: "Comprehensive admin dashboard for user and server management"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time monitoring and detailed connection statistics"
    },
    {
      icon: Shield,
      title: "24/7 Protection",
      description: "Always-on security with automatic failover protection"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    VPNShield
                  </h1>
                  <p className="text-purple-200 text-lg">Management Portal</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
                Enterprise-grade VPN service with comprehensive management tools, 
                global server network, and advanced security features.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mt-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="glass p-6 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-purple-300" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="glass-strong p-8 w-full max-w-md">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                  <p className="text-gray-300">
                    Sign in to access your VPN management dashboard
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={onLogin}
                    className="w-full btn-primary text-lg py-4 hover:transform hover:scale-105 transition-all duration-300"
                  >
                    <Shield className="w-5 h-5" />
                    Sign In with Emergent Auth
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Secure authentication powered by Emergent platform
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">50+</div>
                      <div className="text-xs text-gray-400">Servers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">20+</div>
                      <div className="text-xs text-gray-400">Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">99.9%</div>
                      <div className="text-xs text-gray-400">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features Bar */}
        <div className="mt-16 glass p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Why Choose VPNShield?</h3>
            <p className="text-gray-300">Built for enterprises, loved by users worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-medium">Ultra Fast</h4>
              <p className="text-gray-400 text-sm mt-1">Optimized for speed</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-medium">Global Network</h4>
              <p className="text-gray-400 text-sm mt-1">Worldwide coverage</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-medium">Secure</h4>
              <p className="text-gray-400 text-sm mt-1">Military-grade encryption</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-white font-medium">Analytics</h4>
              <p className="text-gray-400 text-sm mt-1">Real-time insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;