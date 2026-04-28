interface Props { children: string; center?: boolean; className?: string }
export default function SectionLabel({ children, center, className = '' }: Props) {
  return (
    <div className={`section-label mb-4 ${center ? 'justify-center' : ''} ${className}`}>
      {children}
    </div>
  )
}
