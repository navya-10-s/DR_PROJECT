"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Shield, Zap, Star, Quote, X, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false) // Simulated auth state
  const [showAuthAlert, setShowAuthAlert] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isSignedIn")
    if (authStatus === "true") {
      setIsSignedIn(true)
    }
  }, [])

  const toggleAuthState = () => {
    const newAuthState = !isSignedIn
    setIsSignedIn(newAuthState)
    localStorage.setItem("isSignedIn", newAuthState.toString())
  }

  const handleStartScreening = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      setShowAuthAlert(true)
      return
    }
    // If signed in, navigate to screening page
    window.location.href = "/screening"
  }

  return (
    <div className="min-h-screen bg-background">
      {showAuthAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-2">Authentication Required</h3>
                <p className="text-sm text-red-700 mb-3">
                  Please sign up or create an account to access the screening functionality.
                </p>
                <div className="flex gap-2">
                  <Link href="/signin">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
              <button onClick={() => setShowAuthAlert(false)} className="text-red-400 hover:text-red-600 ml-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">RetinaScan AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Signed In</span>
                  <Button variant="outline" size="sm" onClick={toggleAuthState}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  AI-Powered Medical Screening
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Early Detection of <span className="text-primary">Diabetic Retinopathy</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Advanced AI technology that helps healthcare professionals detect diabetic retinopathy with 95%
                  accuracy, enabling early intervention and preventing vision loss.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleStartScreening}>
                  Start Screening
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Results in 30 seconds</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-card to-muted p-8 flex items-center justify-center">
                <img
                  src="/medical-eye-scan-retinal-imaging-diabetic-retinopa.jpg"
                  alt="Diabetic retinopathy screening interface showing retinal scan analysis"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Revolutionizing Diabetic Eye Care</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Diabetic retinopathy affects over 93 million people worldwide and is the leading cause of blindness in
              working-age adults. Our AI-powered screening tool enables early detection, helping healthcare providers
              identify at-risk patients before irreversible vision loss occurs.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">30s</div>
                <div className="text-sm text-muted-foreground">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Scans Processed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Advanced AI Screening Features</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Comprehensive analysis powered by cutting-edge machine learning algorithms
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Automated Detection</CardTitle>
                <CardDescription>
                  AI algorithms analyze retinal images to identify signs of diabetic retinopathy with medical-grade
                  accuracy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rapid Results</CardTitle>
                <CardDescription>
                  Get comprehensive screening results in under 30 seconds, enabling immediate clinical decision-making.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Compliant</CardTitle>
                <CardDescription>
                  HIPAA-compliant platform with enterprise-grade security to protect sensitive patient data and medical
                  information.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Trusted by Healthcare Professionals</h2>
            <p className="text-lg text-muted-foreground text-pretty">See what doctors are saying about RetinaScan AI</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "RetinaScan AI has transformed our diabetic eye screening program. The accuracy and speed allow us to
                  screen more patients effectively."
                </p>
                <div>
                  <div className="font-semibold">Dr. Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Ophthalmologist, Metro Health</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "The early detection capabilities have helped us prevent vision loss in numerous patients. It's an
                  invaluable tool for our practice."
                </p>
                <div>
                  <div className="font-semibold">Dr. Michael Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Endocrinologist, City Medical Center</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  "User-friendly interface and reliable results. Our nursing staff can easily operate the system with
                  minimal training."
                </p>
                <div>
                  <div className="font-semibold">Dr. Emily Watson</div>
                  <div className="text-sm text-muted-foreground">Family Medicine, Regional Clinic</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">RetinaScan AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI-powered diabetic retinopathy screening for healthcare professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Training
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">© 2024 RetinaScan AI. All rights reserved.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                <p className="text-xs text-yellow-800 font-medium">
                  <strong>Medical Disclaimer:</strong> This tool is for screening purposes only and should not replace
                  professional medical diagnosis. Always consult with qualified healthcare professionals for medical
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
