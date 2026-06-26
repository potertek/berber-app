export const SALON_INFO = {
  name: 'Ozan Cin Hair Art Studio',
  slogan: 'Men Hair Stylis · Renklendirme · Kesim',
  address: '6485 Sokak No:2/A Yalı Mahallesi Karşıyaka / İzmir',
  phone: '+90 533 000 00 00',
  whatsapp: '+905330000000',
  mapsUrl: 'https://maps.google.com/?q=Karşıyaka+İzmir',
  instagram: 'ozancinhairart',
  instagramUrl: 'https://www.instagram.com/ozancinhairart',
  rating: 4.9,
  reviewCount: 48,
  totalScore: 138,
  coverImage: '/cover.jpg',
  gender: 'Erkek Bölümü',
}

export const WORKING_HOURS: { day: string; open: string; close: string; closed: boolean }[] = [
  { day: 'Pazartesi', open: '09:00', close: '20:00', closed: false },
  { day: 'Salı', open: '09:00', close: '20:00', closed: false },
  { day: 'Çarşamba', open: '09:00', close: '20:00', closed: false },
  { day: 'Perşembe', open: '09:00', close: '20:00', closed: false },
  { day: 'Cuma', open: '09:00', close: '20:00', closed: false },
  { day: 'Cumartesi', open: '09:00', close: '20:00', closed: false },
  { day: 'Pazar', open: '', close: '', closed: true },
]

export const STAFF = [
  { id: 'ozan', name: 'Ozan Cin', role: 'Master Berber', available: true },
  { id: 'asistan', name: 'Asistan', role: 'Berber', available: true },
]

export type Service = {
  id: string
  name: string
  category: 'hair' | 'makeup' | 'skin'
  duration: number
  price: number
}

export const SERVICES: Service[] = [
  // Hair
  { id: 'sac-kesimi', name: 'Saç Kesimi', category: 'hair', duration: 30, price: 150 },
  { id: 'fon', name: 'Fön', category: 'hair', duration: 20, price: 100 },
  { id: 'kac-alimi', name: 'Kaş Alımı', category: 'hair', duration: 15, price: 80 },
  { id: 'sac-bakimi', name: 'Saç Bakımı', category: 'hair', duration: 45, price: 250 },
  { id: 'sac-boyama', name: 'Saç Boyama', category: 'hair', duration: 90, price: 500 },
  { id: 'sakal-tirasi', name: 'Sakal Tıraşı', category: 'hair', duration: 20, price: 100 },
  { id: 'cilt-bakimi-h', name: 'Cilt Bakımı', category: 'hair', duration: 30, price: 200 },
  // Makeup
  { id: 'gunluk-makyaj', name: 'Günlük Makyaj', category: 'makeup', duration: 45, price: 400 },
  { id: 'gelin-makyaj', name: 'Gelin Makyajı', category: 'makeup', duration: 90, price: 1200 },
  { id: 'ozel-gun', name: 'Özel Gün Makyajı', category: 'makeup', duration: 60, price: 700 },
  // Skin
  { id: 'nem-maskesi', name: 'Nem Maskesi', category: 'skin', duration: 30, price: 300 },
  { id: 'derin-temizlik', name: 'Derin Temizlik', category: 'skin', duration: 60, price: 450 },
  { id: 'anti-aging', name: 'Anti-Aging Bakım', category: 'skin', duration: 75, price: 600 },
]

export const REVIEWS = [
  { id: '1', username: 'şab...r', stars: 5, comment: 'Fikret beyden çok memnunum teşekkür ediyorum.', date: '17 Haziran 2026' },
  { id: '2', username: 'har...ş', stars: 5, comment: 'Hz Bi Ka fofana', date: '17 Haziran 2026' },
  { id: '3', username: 'fur...n', stars: 5, comment: 'Çok memnun kaldım istediğimden daha güzel yapılı saçımı herkez gitsin', date: '17 Haziran 2026' },
  { id: '4', username: 'f.y...y', stars: 5, comment: 'Saçlarımı güzel öptüler', date: '12 Haziran 2026' },
  { id: '5', username: 'tah...y', stars: 5, comment: 'Her zaman temiz ve güler yüzlü Ozan Bey ve ekibi ne yazsam az gelir. Her şey için çok teşekkür ederim.', date: '11 Haziran 2026' },
  { id: '6', username: 'çağ...ğ', stars: 5, comment: 'Bir dükkan düşünün her şeyde mi mükemmel olur Elinize sağlık', date: '11 Haziran 2026' },
]

export const INSTAGRAM_INFO = {
  username: 'ozancinhairart',
  displayName: 'Ozan Cin',
  posts: 12,
  followers: 987,
  following: 945,
  bio: 'MEN HAIR STYLIS RENKLENDİRME VE KESİM\n6485 sokak no 2/A Yalı mahallesi\nKARŞIYAKA / İZMİR',
  profileUrl: 'https://www.instagram.com/ozancinhairart',
}
