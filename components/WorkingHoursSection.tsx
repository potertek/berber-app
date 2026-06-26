import { WORKING_HOURS } from '@/lib/data'

export default function WorkingHoursSection() {
  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  return (
    <div>
      <h2 className="section-title">Çalışma Saatleri</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {WORKING_HOURS.map((row, i) => (
              <tr
                key={row.day}
                className={`border-b border-gray-50 last:border-0 ${
                  i === todayIndex ? 'bg-green-50' : ''
                }`}
              >
                <td className={`py-3 pl-4 font-medium ${i === todayIndex ? 'text-brand-green' : 'text-gray-700'}`}>
                  {row.day}
                  {i === todayIndex && (
                    <span className="ml-1 text-xs text-brand-green">(bugün)</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right">
                  {row.closed ? (
                    <span className="text-red-500 font-medium">Kapalı</span>
                  ) : (
                    <span className="text-gray-600">
                      {row.open} - {row.close}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
