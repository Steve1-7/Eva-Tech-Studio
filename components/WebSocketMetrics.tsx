'use client'
import { useEffect, useState, useCallback } from 'react'
import CountUp from './CountUp'

interface LiveMetric {
  id: string
  name: string
  value: number
  unit: string
  trend: number
  color: string
  sparkline: number[]
}

// Simulated WebSocket connection for demo
export default function WebSocketMetrics() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    { id: '1', name: 'Active Users', value: 2847, unit: '', trend: 12, color: '#4A7A64', sparkline: [20, 35, 45, 30, 55, 65, 80] },
    { id: '2', name: 'Revenue/Min', value: 3420, unit: 'R', trend: 8, color: '#C9A96E', sparkline: [40, 30, 50, 45, 60, 55, 70] },
    { id: '3', name: 'Conversion', value: 4.8, unit: '%', trend: -2, color: '#6BA889', sparkline: [60, 55, 45, 50, 40, 55, 48] },
    { id: '4', name: 'Page Load', value: 0.8, unit: 's', trend: -15, color: '#E8C97A', sparkline: [80, 75, 70, 65, 60, 55, 50] },
  ])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    setLastUpdate(new Date())
  }, [])

  // Simulate WebSocket updates
  useEffect(() => {
    if (!isMounted) return
    
    // Simulate connection establishment
    const connectTimeout = setTimeout(() => {
      setConnectionStatus('connected')
    }, 1500)

    // Simulate receiving data
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          // Random fluctuation
          const fluctuation = (Math.random() - 0.5) * 0.1
          const newValue = metric.value * (1 + fluctuation)
          
          // Update sparkline
          const newSparkline = [...metric.sparkline.slice(1), Math.random() * 100]
          
          // Calculate trend
          const trend = ((newValue - metric.value) / metric.value) * 100

          return {
            ...metric,
            value: newValue,
            sparkline: newSparkline,
            trend: parseFloat(trend.toFixed(1)),
          }
        })
      )
      setLastUpdate(new Date())
    }, 3000)

    // Simulate occasional disconnection
    const disconnectInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setConnectionStatus('disconnected')
        setTimeout(() => setConnectionStatus('connected'), 2000)
      }
    }, 15000)

    return () => {
      clearTimeout(connectTimeout)
      clearInterval(interval)
      clearInterval(disconnectInterval)
    }
  }, [])

  const formatValue = (value: number, unit: string) => {
    if (unit === 'R') return `R${Math.round(value).toLocaleString()}`
    if (unit === '%') return `${value.toFixed(1)}%`
    if (unit === 's') return `${value.toFixed(2)}s`
    return Math.round(value).toLocaleString()
  }

  return (
    <div className="rounded-[24px] p-6" style={{ background: 'var(--obsidian-3)', border: '1px solid rgba(232,227,216,0.06)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-[1rem] mb-1" style={{ color: '#E8E3D8' }}>
            Live System Metrics
          </h3>
          <p className="text-[0.75rem]" style={{ color: '#6B6860' }}>
            Real-time data via WebSocket
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
            'bg-red-400'
          }`} />
          <span className="text-[0.7rem] font-medium" style={{ color: '#6B6860' }}>
            {connectionStatus === 'connected' ? 'LIVE' : 
             connectionStatus === 'connecting' ? 'CONNECTING...' : 'RECONNECTING'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id}
            className="p-4 rounded-[16px] transition-all"
            style={{ background: 'var(--obsidian-4)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.7rem] font-medium" style={{ color: '#6B6860' }}>
                {metric.name}
              </span>
              <div className={`flex items-center text-[0.65rem] font-bold ${
                metric.trend > 0 ? 'text-emerald-400' : metric.trend < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {metric.trend > 0 ? '↑' : metric.trend < 0 ? '↓' : '→'}
                {Math.abs(metric.trend).toFixed(1)}%
              </div>
            </div>

            <div className="font-cormorant text-[1.8rem] font-bold mb-3" style={{ color: metric.color }}>
              {formatValue(metric.value, metric.unit)}
            </div>

            {/* Sparkline */}
            <div className="h-8 flex items-end gap-[2px]">
              {metric.sparkline.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(10, value)}%`,
                    background: metric.color,
                    opacity: 0.3 + (i / metric.sparkline.length) * 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[rgba(232,227,216,0.05)] flex items-center justify-between">
        <span className="text-[0.65rem]" style={{ color: '#3A3830' }}>
          Last update: {isMounted && lastUpdate ? lastUpdate.toLocaleTimeString() : 'Connecting...'}
        </span>
        <div className="flex items-center gap-4 text-[0.65rem]" style={{ color: '#3A3830' }}>
          <span>Latency: 24ms</span>
          <span>Updates: 3s</span>
        </div>
      </div>
    </div>
  )
}
