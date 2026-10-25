'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [deliveryFee, setDeliveryFee] = useState(150);
  const [commissionRate, setCommissionRate] = useState(15);
  const [supportEmail, setSupportEmail] = useState('support@foodverse.pk');
  const [supportPhone, setSupportPhone] = useState('+92-21-1234-5678');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure delivery fees, commission rates, and support contact</p>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
            <div>
              <h3 className="font-semibold text-green-900">Settings Saved</h3>
              <p className="text-sm text-green-800">Your changes have been applied to new orders</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          {/* Delivery Fee */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Base Delivery Fee (PKR)</label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Applied to all new orders</p>
          </div>

          {/* Commission Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Commission Rate (%)</label>
            <input
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Percentage taken from restaurant orders</p>
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Contact address shown to users</p>
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Support Phone</label>
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Contact number shown to users</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2.5 rounded-lg font-semibold text-sm transition"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">⚠️ Important</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Settings apply to new orders immediately</li>
            <li>Existing orders retain their original rates</li>
            <li>Changes are logged for audit purposes</li>
            <li>All users are notified of major changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
