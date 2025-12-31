import SignupForm from '@/components/auth/SignupForm'
import Footer from '@/components/layout/Footer'
import { Rocket } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-lg animate-float">
                <Rocket className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-2 text-gradient">Start Your Journey! 🚀</h1>
            <p className="text-lg text-purple-600 font-medium">Create an account and boost your productivity</p>
          </div>
          <SignupForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
