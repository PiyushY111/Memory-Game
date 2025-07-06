"use client"

// import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from "lucide-react"
import { useAuth } from './contexts/AuthContext';
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
// import {Router} from "react-router-dom"
// import { useToast } from "@/components/ui/use-toast"

export default function AuthPage() {

  //   const { toast } = useToast()
  const router = useNavigate()

  const [activeTab, setActiveTab] = useState("login")
  const { login, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [signupForm, setSignupForm] = useState({
    // name: "",
    email: "",
    password: "",
  })

  // Handle input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupForm((prev) => ({ ...prev, [name]: value }))
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password } = loginForm
      await login(email, password);
      toast.success("Login successful")
      router("/")
    } catch (error) {
      toast.error(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password } = signupForm
      await signup(email, password);

      toast.success("Signup successful")
      router("/")
      setActiveTab("login")
    } catch (error) {
      toast.error(error.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div id="Globe-venta" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome to MatchUp Game</h1>
          <p className="mt-2 text-slate-400">Sign in to your account or create a new one</p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-slate-700 text-white">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-slate-700 text-white">
              Sign up
            </TabsTrigger>
          </TabsList>

          <Card className="border-slate-800 bg-slate-900 shadow-lg">
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLoginSubmit}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white">Login</CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="you@example.com"
                        className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-slate-300">
                        Password
                      </Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        className="pl-10 pr-10 bg-slate-800 border-slate-700 text-slate-200 focus:border-slate-600 focus:ring-slate-600"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-slate-500 hover:text-slate-300"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleSignupSubmit}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white">Create an account</CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                      <Input
                        id="email-signup"
                        name="email"
                        type="email"
                        value={signupForm.email}
                        onChange={handleSignupChange}
                        placeholder="you@example.com"
                        className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                      <Input
                        id="password-signup"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={signupForm.password}
                        onChange={handleSignupChange}
                        className="pl-10 pr-10 bg-slate-800 border-slate-700 text-slate-200 focus:border-slate-600 focus:ring-slate-600"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-slate-500 hover:text-slate-300"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Card>
        </Tabs>

        <div className="mt-6 text-center text-sm text-slate-400">
          {activeTab === "login" ? (
            <p>
              Don't have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-purple-400 hover:text-purple-300"
                onClick={() => setActiveTab("signup")}
              >
                Sign up
              </Button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-purple-400 hover:text-purple-300"
                onClick={() => setActiveTab("login")}
              >
                Login
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
