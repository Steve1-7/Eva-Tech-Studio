'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const [prevPathname, setPrevPathname] = useState(pathname)

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsTransitioning(true)
      
      // Start exit animation
      setTimeout(() => {
        setDisplayChildren(children)
        setPrevPathname(pathname)
        
        // Start enter animation
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 300)
    } else {
      setDisplayChildren(children)
    }
  }, [pathname, children, prevPathname])

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isTransitioning 
          ? 'opacity-0 translate-y-4 scale-[0.98]' 
          : 'opacity-100 translate-y-0 scale-100'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {displayChildren}
    </div>
  )
}
