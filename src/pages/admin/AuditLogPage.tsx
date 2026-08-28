import { ShieldCheck } from 'lucide-react'
import { ModulePlaceholder } from '../../components/common/ModulePlaceholder'

export function AuditLogPage() {
  return (
    <ModulePlaceholder
      title="Audit Log"
      description="Pantau rekam jejak aktivitas penting dalam sistem."
      icon={ShieldCheck}
    />
  )
}
