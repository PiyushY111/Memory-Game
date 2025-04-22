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
  const { login, signup, loginWithGoogle } = useAuth();
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

  const mockGoogleLoginApi = async () => {
        await loginWithGoogle();
  }
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password } = loginForm
      const response = await login(email, password);
        toast.success("Login successful")
        router("/")
    } catch (error) {
      toast.error(error.code.includes("/")?error.code.split("/")[1]:error.code)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { email, password } = signupForm
      const response = await signup(email, password);

    //   if (response.success) {
        toast.success("Signup successful")
        router("/")
        // Here you would typically:
        // 1. Store the user token in localStorage/cookies
        // 2. Update global auth state
        // 3. Redirect to dashboard or login
        setActiveTab("login")
    //   } else {
    //     toast.error("Signup failed")
    //   }
    } catch (error) {
        // console.log(error.code)
      toast.error(error.code.includes("/")?error.code.split("/")[1]:error.code)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      const response = await mockGoogleLoginApi()

      // if (response.success) {
        toast.success("Google login successful")
        router("/")
      // }
    } catch (error) {
      toast.error(error.code.includes("/")?error.code.split("/")[1]:error.code)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 p-4">
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
                      {/* <Button variant="link" className="h-auto p-0 text-xs text-slate-400 hover:text-slate-300">
                        Forgot password?
                      </Button> */}
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

                  <div className="relative my-4">
                    <Separator className="bg-slate-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-slate-900 px-2 text-xs text-slate-400">OR CONTINUE WITH</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    Login with Google
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
                  {/* <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                      <Input
                        id="name"
                        name="name"
                        value={signupForm.name}
                        onChange={handleSignupChange}
                        placeholder="John Doe"
                        className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600"
                        required
                      />
                    </div>
                  </div> */}
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

                  <div className="relative my-4">
                    <Separator className="bg-slate-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-slate-900 px-2 text-xs text-slate-400">OR CONTINUE WITH</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    )}
                    Sign up with Google
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
