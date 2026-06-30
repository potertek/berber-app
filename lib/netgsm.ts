const NETGSM_SEND_URL = 'https://api.netgsm.com.tr/sms/send/get'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('90')) return digits.slice(2)
  if (digits.startsWith('0')) return digits.slice(1)
  return digits
}

export function isSmsConfigured(): boolean {
  return !!(process.env.NETGSM_USERCODE && process.env.NETGSM_PASSWORD && process.env.NETGSM_MSGHEADER)
}

export async function sendSms(phone: string, message: string): Promise<void> {
  const usercode = process.env.NETGSM_USERCODE
  const password = process.env.NETGSM_PASSWORD
  const msgheader = process.env.NETGSM_MSGHEADER

  if (!usercode || !password || !msgheader) {
    console.log(`[netgsm:dev] SMS to ${phone}: ${message}`)
    return
  }

  const params = new URLSearchParams({
    usercode,
    password,
    gsmno: normalizePhone(phone),
    message,
    msgheader,
    dil: 'TR',
  })

  const res = await fetch(`${NETGSM_SEND_URL}?${params.toString()}`)
  const text = (await res.text()).trim()

  // Netgsm başarı kodları "00" veya "01" ile başlar (jobid takip eder)
  if (!text.startsWith('00') && !text.startsWith('01')) {
    throw new Error(`Netgsm SMS gönderimi başarısız: ${text}`)
  }
}
