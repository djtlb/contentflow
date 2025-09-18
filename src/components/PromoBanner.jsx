import React, { useState, useEffect } from 'react'
import { supabase } from '../App'
import { apiUrl } from '../lib/config'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, Megaphone, Gift, Zap, AlertTriangle } from 'lucide-react'

const PromoBanner = () => {
  const [promos, setPromos] = useState([])
  const [dismissedPromos, setDismissedPromos] = useState(new Set())

  useEffect(() => {
    fetchActivePromos()
    loadDismissedPromos()
  }, [])

  const fetchActivePromos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(apiUrl('/api/admin/promos'), {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        const activePromos = (result.data || []).filter(promo => 
          promo.active && 
          (!promo.expires_at || new Date(promo.expires_at) > new Date())
        )
        setPromos(activePromos)
        
        // Track views for analytics
        activePromos.forEach(promo => {
          trackPromoView(promo.id)
        })
      }
    } catch (error) {
      console.error('Error fetching promos:', error)
    }
  }

  const trackPromoView = async (promoId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`http://localhost:3001/api/admin/promos/${promoId}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error tracking promo view:', error)
    }
  }

  const trackPromoClick = async (promoId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`http://localhost:3001/api/admin/promos/${promoId}/click`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error tracking promo click:', error)
    }
  }

  const loadDismissedPromos = () => {
    const dismissed = localStorage.getItem('dismissedPromos')
    if (dismissed) {
      setDismissedPromos(new Set(JSON.parse(dismissed)))
    }
  }

  const dismissPromo = (promoId) => {
    const newDismissed = new Set([...dismissedPromos, promoId])
    setDismissedPromos(newDismissed)
    localStorage.setItem('dismissedPromos', JSON.stringify([...newDismissed]))
  }

  const handlePromoClick = (promo) => {
    trackPromoClick(promo.id)
    // You can add custom click handling here (e.g., redirect to pricing page)
  }

  const getPromoIcon = (type) => {
    switch (type) {
      case 'success': return Gift
      case 'warning': return AlertTriangle
      case 'error': return AlertTriangle
      default: return Megaphone
    }
  }

  const getPromoVariant = (type) => {
    switch (type) {
      case 'success': return 'default'
      case 'warning': return 'destructive'
      case 'error': return 'destructive'
      default: return 'default'
    }
  }

  const visiblePromos = promos.filter(promo => !dismissedPromos.has(promo.id))

  if (visiblePromos.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {visiblePromos.map((promo) => {
        const Icon = getPromoIcon(promo.type)
        
        return (
          <Alert key={promo.id} variant={getPromoVariant(promo.type)} className="relative">
            <Icon className="h-4 w-4" />
            <AlertDescription className="pr-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <strong className="font-semibold">{promo.title}</strong>
                  <p className="mt-1">{promo.message}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {promo.message.includes('code') && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePromoClick(promo)}
                      className="whitespace-nowrap"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Claim Offer
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissPromo(promo.id)}
                    className="h-6 w-6 p-0 hover:bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}

export default PromoBanner
