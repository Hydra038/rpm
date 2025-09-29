"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from '../components/AdminLayout';
import { CreditCard, Building, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentSettings {
  id: number;
  paypal_email: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  sort_code: string;
  swift_code: string;
  bank_address: string;
  payment_instructions: string;
}

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    paypal_email: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    sort_code: '',
    swift_code: '',
    bank_address: '',
    payment_instructions: ''
  });

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  async function loadPaymentSettings() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/payment-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
          setFormData({
            paypal_email: data.settings.paypal_email || '',
            bank_name: data.settings.bank_name || '',
            account_holder_name: data.settings.account_holder_name || '',
            account_number: data.settings.account_number || '',
            sort_code: data.settings.sort_code || '',
            swift_code: data.settings.swift_code || '',
            bank_address: data.settings.bank_address || '',
            payment_instructions: data.settings.payment_instructions || ''
          });
        }
      } else {
        throw new Error('Failed to load payment settings');
      }
    } catch (error: any) {
      setMessage(`Error loading payment settings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Payment settings have been successfully updated! All changes are now active for customer checkout.');
        loadPaymentSettings();
        // Clear the message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } else {
        throw new Error(data.error || 'Failed to save payment settings');
      }
    } catch (error: any) {
      setMessage(`Error saving payment settings: ${error.message}`);
      // Clear error message after 8 seconds
      setTimeout(() => setMessage(''), 8000);
    } finally {
      setSaving(false);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h2>
        <p className="text-gray-600">Configure PayPal and bank transfer details for customer payments</p>
      </div>

      {message && (
        <Card className={`mb-6 shadow-md ${message.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {message.includes('Error') ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${message.includes('Error') ? 'text-red-700' : 'text-green-700'}`}>
                  {message}
                </p>
                {!message.includes('Error') && (
                  <p className="text-sm text-green-600 mt-1">
                    These settings will now be displayed to customers during checkout.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading payment settings...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PayPal Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                PayPal Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">PayPal Email Address</label>
                <input
                  type="email"
                  value={formData.paypal_email}
                  onChange={(e) => handleInputChange('paypal_email', e.target.value)}
                  placeholder="payments@yourcompany.com"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  This email will be displayed to customers for PayPal payments
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-green-600" />
                Bank Transfer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                    placeholder="Barclays Bank UK"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.account_holder_name}
                    onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                    placeholder="RPM Genuine Auto Parts Ltd"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account Number</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                    placeholder="12345678"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort Code</label>
                  <input
                    type="text"
                    value={formData.sort_code}
                    onChange={(e) => handleInputChange('sort_code', e.target.value)}
                    placeholder="20-00-00"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SWIFT Code (Optional)</label>
                <input
                  type="text"
                  value={formData.swift_code}
                  onChange={(e) => handleInputChange('swift_code', e.target.value)}
                  placeholder="BARCGB22"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bank Address (Optional)</label>
                <textarea
                  value={formData.bank_address}
                  onChange={(e) => handleInputChange('bank_address', e.target.value)}
                  placeholder="1 Churchill Place, London E14 5HP, UK"
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium mb-2">Instructions for Customers</label>
                <textarea
                  value={formData.payment_instructions}
                  onChange={(e) => handleInputChange('payment_instructions', e.target.value)}
                  placeholder="Please include your order number as payment reference. For bank transfers, allow 1-2 business days for processing."
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  These instructions will be shown to customers during checkout and on invoices
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Save Payment Settings</h3>
                    <p className="text-sm text-gray-600">
                      Update payment methods and instructions for customers
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}