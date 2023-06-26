import { useEffect, useState } from "react"

const base64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(b64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function Home() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (window as any).workbox !== undefined) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub)
          }
        })
        setRegistration(reg)
      })
    }
  }, [])

  
  const subscribe = async () => {
    const sub = await registration!.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!)
    })
    // TODO: you should call your API to save subscription data on server in order to send web push notification from server
    setSubscription(sub)
    console.log('web push subscribed!')
    console.log(sub)
  }
  
  const notifyClients = () => {
     fetch('/api/notification', { 
      method: "POST",       
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        subscription
      }) 
    })
  }

  return (
    <main className="flex min-h-screen justify-center gap-8 items-center p-24">
      <button className="bg-slate-600 text-white h-12 w-52" onClick={subscribe}>SUBSCRIBE!</button> 
      <button className="bg-slate-600 text-white h-12 w-52" onClick={notifyClients}>NOTIFY!</button> 
    </main>
  )
}
