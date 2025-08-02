'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmail } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Loader2, Mail, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (!email) {
      router.replace('/dashboard')
    }
  }, [email, router])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setIsAnimated(true)
      }, 200)
    }
  }, [success])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!code || code.length !== 6) {
      setError('Kode verifikasi harus terdiri dari 6 angka')
      return
    }

    setLoading(true)
    setError('')

    try {
      await verifyEmail({ email: email as string, verification_code: code })
      setSuccess(true)
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Terjadi kesalahan saat verifikasi'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (!email) return null

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 network-lines" />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-9xl font-light text-neon-blue/5 pointer-events-none">
          確認済み
        </div>

        <div className="relative z-10 w-full max-w-md px-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <CardHeader className="space-y-4 pb-6">
              <div className="flex justify-center">
                <div
                  className={`transition-all duration-1000 ${
                    isAnimated ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                >
                  <div className="relative">
                    <CheckCircle className="w-20 h-20 text-neon-blue mx-auto" />
                    <div
                      className={`absolute inset-0 rounded-full border-2 border-neon-blue ${
                        isAnimated ? 'animate-ping' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-white">
                Email Verified Successfully!
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Your email is verified! Welcome to Sekai-Set-On.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
                <Mail className="w-6 h-6 text-neon-blue mx-auto mb-2" />
                <p className="text-white/80 text-sm">
                  Your account is now active and ready to use.
                  You can start accessing the Japanese API platform immediately.
                </p>
              </div>

              <div className="space-y-2 text-sm text-white/60">
                <p>✓ Account activated</p>
                <p>✓ API access enabled</p>
                <p>✓ Dashboard access granted</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                asChild
                className="w-full bg-neon-blue text-black hover:bg-neon-cyan transition-all duration-300 h-11 text-lg font-medium"
              >
                <Link
                  href="/signin"
                  className="flex items-center justify-center space-x-2"
                >
                  <span>Go to Signin Page</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-neon-cyan hover:text-neon-blue transition-colors text-sm"
                >
                  Return to Home
                </Link>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-2">開始準備完了 (Setup Complete)</p>
            <p className="text-white/60 text-xs">
              Need help getting started? Check out our{' '}
              <Link href="/docs" className="text-neon-blue hover:underline">
                documentation
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 network-lines" />
      <div className="absolute top-20 left-10 text-9xl font-light text-neon-blue/5 pointer-events-none">
        ヴェリフィカチオン
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Verifikasi Email
            </CardTitle>
            <CardDescription className="text-white/70 text-base pt-2">
              Masukkan kode yang dikirim ke <b>{email}</b>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Masukkan 6 digit kode"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="tracking-widest text-center text-lg"
              />
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-neon-blue text-black hover:bg-neon-cyan transition-all duration-300 h-11 text-lg font-medium"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verifikasi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
