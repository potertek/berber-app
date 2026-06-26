import { INSTAGRAM_INFO } from '@/lib/data'

export default function InstagramSection() {
  return (
    <div>
      <h2 className="section-title">Instagram</h2>
      <div className="card p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-1 text-center">
            <div>
              <p className="text-base font-bold text-gray-900">{INSTAGRAM_INFO.posts}</p>
              <p className="text-xs text-gray-500">Gönderi</p>
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{INSTAGRAM_INFO.followers}</p>
              <p className="text-xs text-gray-500">Takipçi</p>
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{INSTAGRAM_INFO.following}</p>
              <p className="text-xs text-gray-500">Takip</p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm font-bold text-gray-900">{INSTAGRAM_INFO.displayName}</p>
          <p className="text-xs text-gray-500 mt-1 whitespace-pre-line leading-relaxed">
            {INSTAGRAM_INFO.bio}
          </p>
        </div>

        <a
          href={INSTAGRAM_INFO.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold py-2.5 rounded-xl text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          @{INSTAGRAM_INFO.username} — Takip Et
        </a>
      </div>
    </div>
  )
}
