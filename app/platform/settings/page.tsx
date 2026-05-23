'use client'

import { Settings } from 'lucide-react'

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="page-title">إعدادات المنصة</h1>

      <div className="card-base p-8 text-center text-dark-200">
        <Settings className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg">إعدادات المنصة</p>
        <p className="text-sm mt-2">الدومين الأساسي، بيانات الدفع، والمزيد — قريباً</p>
      </div>
    </div>
  )
}
