import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import type { StaffMember } from '@/types'

interface Props {
  staff: StaffMember[]
}

export function StaffSection({ staff }: Props) {
  if (staff.length === 0) return null

  return (
    <section className="px-4 py-5">
      <h2 className="text-lg font-black text-brand-black mb-3">Ekibimiz</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {staff.map(member => (
          <Card key={member.id} className="flex-shrink-0 w-32 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mx-auto mb-2">
              {member.photo_url ? (
                <Image src={member.photo_url} alt={member.name} width={64} height={64} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-black flex items-center justify-center text-white text-xl font-black">
                  {member.name[0]}
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-brand-black truncate">{member.name}</p>
            {member.title && (
              <p className="text-xs text-gray-400 truncate">{member.title}</p>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}
