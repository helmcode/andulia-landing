'use client'
import { useState } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Cloud, Terminal, GitBranch, BarChart3, Code2, BrainCircuit, MessageSquare } from "lucide-react"
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

function BetaSignupForm() {
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    if (!executeRecaptcha) {
      setMessage({
        type: 'error',
        text: 'reCAPTCHA not ready. Please try again.'
      })
      return
    }

    try {
      const token = await executeRecaptcha('beta_signup')

      if (!token) {
        throw new Error('Failed to generate reCAPTCHA token')
      }

      formData.append('recaptchaToken', token)

      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setMessage({
        type: 'success',
        text: "Thank you for joining our beta! We'll be in touch soon."
      })
      form.reset()

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred. Please try again later.'
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md backdrop-blur-lg bg-white/5 p-8 rounded-xl shadow-2xl border border-white/10"
    >
      <h3 className="text-2xl font-bold text-center mb-4">Join Our Beta</h3>
      <div className="flex gap-4">
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="bg-white/5 border-white/10 focus:border-[#6c62ff] transition-colors"
          required
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="bg-white/5 border-white/10 focus:border-[#6c62ff] transition-colors"
          required
        />
      </div>
      <Input
        type="email"
        name="email"
        placeholder="Enter your email for beta access"
        className="bg-white/5 border-white/10 focus:border-[#6c62ff] transition-colors"
        required
      />
      <Button className="bg-[#6c62ff] hover:bg-[#6c62ff]/80 transform hover:scale-105 transition-all duration-200">
        Get Free Beta Access <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success'
            ? 'bg-green-500/10 text-green-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {message.text}
        </div>
      )}
    </form>
  )
}

export default function Home() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-8">
            <Image
              src="/images/andulia.jpg"
              alt="Andulia Logo"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#e5f0ff] to-[#6c62ff] bg-clip-text text-transparent">
            Your AI-Powered Cloud Assistant
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-[#e5f0ff]/80">
            Effortlessly manage your cloud infrastructure using natural language. Andulia understands your needs and helps
            you manage your Cloud resources like never before.
          </p>
          <BetaSignupForm />
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Cloud />}
              title="Resource Management"
              description="List and manage all your Cloud resources with simple natural language commands."
            />
            <FeatureCard
              icon={<Terminal />}
              title="Resource Details"
              description="Get specific details about any service - IPs, endpoints, disk space, instance types, and more."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="FinOps Made Easy"
              description="Estimate costs for entire environments or specific resources with simple queries."
            />
            <FeatureCard
              icon={<Code2 />}
              title="Code Generation"
              description="Generate Terraform, bash, or any other code based on your existing resources."
            />
            <FeatureCard
              icon={<BrainCircuit />}
              title="Smart Analysis"
              description="Analyze metrics and get intelligent insights about your infrastructure."
            />
            <FeatureCard
              icon={<MessageSquare />}
              title="Context-Aware Chat"
              description="Chat with memory - Andulia remembers your previous interactions for better assistance."
            />
          </div>
        </section>

        {/* Example Screenshots */}
        <section className="container mx-auto px-4 py-16 space-y-12">
          <h2 className="text-3xl font-bold text-center mb-12">See Andulia in Action</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Resource Information Retrieval</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Get specific information about your AWS resources with natural language queries
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/get_ip.png"
                  alt="Andulia AWS resource information retrieval"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Resource Listing</h3>
                <p className="text-[#e5f0ff]/70 mb-4">List and manage your AWS resources effortlessly</p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/list.png"
                  alt="Andulia AWS resource listing"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">FinOps Made Easy</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Estimate costs for entire environments or specific resources with simple queries
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/finops.png"
                  alt="Andulia FinOps Made Easy"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Code Generation</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Generate Terraform, bash, or any other code based on your existing resources
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/code_gen.png"
                  alt="Andulia Code Generation"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Smart Analysis</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Analyze metrics and get intelligent insights about your infrastructure
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/analysis.png"
                  alt="Andulia Smart Analysis"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Context-Aware Chat</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Chat with memory - Andulia remembers your previous interactions for better assistance
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/chat_memory.png"
                  alt="Andulia Context-Aware Chat"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Multi-Account Support</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Manage multiple AWS accounts with the same natural language interface
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/multiple_aws_accounts.jpeg"
                  alt="Andulia Multi-Account Support"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>

            <Card className="overflow-hidden border-white/10 bg-white/5 transition-transform hover:scale-[1.02]">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">AI Assistants for your all your Cloud resources</h3>
                <p className="text-[#e5f0ff]/70 mb-4">
                  Andulia can be your personal assistant for your all your Cloud resources. AWS, Kubernetes, GCP, GitHub, etc.
                </p>
              </div>
              <div className="relative h-[600px] bg-[#000814]">
                <Image
                  src="/images/ai_assistants.jpeg"
                  alt="Andulia AI Assistants"
                  fill
                  className="object-contain hover:object-cover transition-all duration-300"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-white/10 bg-white/5">
              <GitBranch className="h-12 w-12 mb-4 text-[#6c62ff]" />
              <h3 className="text-xl font-semibold mb-2 text-[#e5f0ff]">Kubernetes Assistant</h3>
              <p className="text-[#e5f0ff]/70">
                Manage your Kubernetes clusters with the same natural language interface
              </p>
            </Card>
            <Card className="p-6 border-white/10 bg-white/5">
              <Cloud className="h-12 w-12 mb-4 text-[#6c62ff]" />
              <h3 className="text-xl font-semibold mb-2 text-[#e5f0ff]">Google Cloud Assistant</h3>
              <p className="text-[#e5f0ff]/70">Extend your cloud management capabilities to Google Cloud Platform</p>
            </Card>
            <Card className="p-6 border-white/10 bg-white/5">
              <Code2 className="h-12 w-12 mb-4 text-[#6c62ff]" />
              <h3 className="text-xl font-semibold mb-2 text-[#e5f0ff]">GitHub Assistant</h3>
              <p className="text-[#e5f0ff]/70">Seamlessly integrate with your GitHub workflows and repositories</p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 mt-16 border-t border-white/10">
          <p className="text-center text-[#e5f0ff]/60">© {new Date().getFullYear()} Helmcode. All rights reserved.</p>
        </footer>
      </main>
    </GoogleReCaptchaProvider>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 border-white/10 bg-white/5">
      <div className="h-12 w-12 mb-4 text-[#6c62ff]">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#e5f0ff]">{title}</h3>
      <p className="text-[#e5f0ff]/70">{description}</p>
    </Card>
  )
}
