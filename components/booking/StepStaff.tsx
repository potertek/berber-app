import Image from 'next/image'
import type { StaffMember } from '@/types'

interface Props {
  staff: StaffMember[]
  selected: StaffMember | null
  noPreference: boolean
  onSelect: (s: StaffMember | null, noPreference: boolean) => void
}

export function StepStaff({ staff, selected, noPreference, onSelect }: Props) {
  return (
    <div className="px-4 py-5 animate-slide-up">
      <h3 className="text-base font-black text-brand-black mb-4">Berber Seç</h3>

      <button
        onClick={() => onSelect(null, true)}
        className={`w-full text-left bg-white rounded-2xl border-2 px-4 py-4 mb-3 transition-all ${noPreference ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 hover:border-gray-200'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">🎲</div>
          <div>
            <p className="font-bold text-sm text-brand-black">Fark etmez</p>
            <p className="text-xs text-gray-400">En uygun berberi ata</p>
          </div>
        </div>
      </button>

      <div className="space-y-2">
        {staff.map(member => (
          <button
            key={member.id}
            onClick={() => onSelect(member, false)}
            className={`w-full text-left bg-white rounded-2xl border-2 px-4 py-3.5 transition-all ${
              selected?.id === member.id && !noPreference ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} width={48} height={48} className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-black flex items-center justify-center text-white font-black">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-brand-black">{member.name}</p>
                {member.title && <p className="text-xs text-gray-400">{member.title}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
