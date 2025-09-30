"use client";
import { useState, useEffect } from 'react';
import { Search, Car, Calendar, Settings, Plus, Trash2, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../lib/supabase/client';
import { getUser } from '../lib/supabase/auth';

interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  engine: string;
  transmission: string;
  fuelType: string;
  bodyStyle: string;
}

interface SavedVehicle {
  id: string;
  vin: string;
  nickname: string;
  vehicle_info: VehicleInfo;
  created_at: string;
}

export function VinLookup({ onVehicleSelect }: { onVehicleSelect?: (vehicle: VehicleInfo & { vin: string }) => void }) {
  const [vin, setVin] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>([]);
  const [nickname, setNickname] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const result = await getUser();
      if (result.user) {
        setUser(result.user);
        loadSavedVehicles(result.user.id);
      }
    }
    loadUser();
  }, []);

  async function loadSavedVehicles(userId: string) {
    try {
      const { data, error } = await supabase
        .from('saved_vehicles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedVehicles(data || []);
    } catch (err) {
      console.error('Error loading saved vehicles:', err);
    }
  }

  function validateVin(vin: string): boolean {
    // Basic VIN validation
    if (vin.length !== 17) return false;
    if (/[IOQ]/.test(vin.toUpperCase())) return false; // I, O, Q not allowed
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  }

  function decodeVin(vin: string): VehicleInfo {
    // This is a simplified VIN decoder for demonstration
    // In a real implementation, you'd use a proper VIN decoding API
    const vinUpper = vin.toUpperCase();
    
    // Extract basic info from VIN structure
    const wmi = vinUpper.substring(0, 3); // World Manufacturer Identifier
    const yearCode = vinUpper.charAt(9);
    
    // Simple make identification (this would be much more comprehensive in reality)
    let make = 'Unknown';
    if (wmi.startsWith('1G') || wmi.startsWith('KL')) make = 'Chevrolet';
    else if (wmi.startsWith('1F') || wmi.startsWith('1HG')) make = 'Ford';
    else if (wmi.startsWith('JHM') || wmi.startsWith('1HG')) make = 'Honda';
    else if (wmi.startsWith('JTD') || wmi.startsWith('4T1')) make = 'Toyota';
    else if (wmi.startsWith('WBA') || wmi.startsWith('WBS')) make = 'BMW';
    else if (wmi.startsWith('WDD') || wmi.startsWith('WDC')) make = 'Mercedes-Benz';
    else if (wmi.startsWith('WAU') || wmi.startsWith('WA1')) make = 'Audi';
    else if (wmi.startsWith('1VW') || wmi.startsWith('WVW')) make = 'Volkswagen';
    
    // Year decoding (simplified)
    const yearCodes: { [key: string]: string } = {
      'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014',
      'F': '2015', 'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019',
      'L': '2020', 'M': '2021', 'N': '2022', 'P': '2023', 'R': '2024', 'S': '2025'
    };
    
    const year = yearCodes[yearCode] || '2020';
    
    return {
      make,
      model: 'Model Identified', // Would be decoded from VIN
      year,
      engine: '2.0L 4-Cylinder', // Would be decoded from VIN
      transmission: 'Automatic', // Would be decoded from VIN
      fuelType: 'Gasoline', // Would be decoded from VIN
      bodyStyle: 'Sedan' // Would be decoded from VIN
    };
  }

  async function handleVinLookup() {
    if (!validateVin(vin)) {
      setError('Please enter a valid 17-digit VIN number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const decoded = decodeVin(vin);
      setVehicleInfo(decoded);
      setSuccess('Vehicle information retrieved successfully!');
      
      if (onVehicleSelect) {
        onVehicleSelect({ ...decoded, vin });
      }
    } catch (err) {
      setError('Failed to decode VIN. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function saveVehicle() {
    if (!user || !vehicleInfo) return;

    try {
      const { error } = await supabase
        .from('saved_vehicles')
        .insert({
          user_id: user.id,
          vin: vin.toUpperCase(),
          nickname: nickname || `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`,
          vehicle_info: vehicleInfo
        });

      if (error) throw error;

      setSuccess('Vehicle saved to your garage!');
      setShowSaveForm(false);
      setNickname('');
      loadSavedVehicles(user.id);
    } catch (err: any) {
      setError(err.message || 'Failed to save vehicle');
    }
  }

  async function deleteSavedVehicle(id: string) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedVehicles(prev => prev.filter(v => v.id !== id));
      setSuccess('Vehicle removed from garage');
    } catch (err: any) {
      setError(err.message || 'Failed to delete vehicle');
    }
  }

  function selectSavedVehicle(vehicle: SavedVehicle) {
    setVin(vehicle.vin);
    setVehicleInfo(vehicle.vehicle_info);
    if (onVehicleSelect) {
      onVehicleSelect({ ...vehicle.vehicle_info, vin: vehicle.vin });
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* VIN Lookup Form */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            VIN Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <input
              type="text"
              placeholder="Enter 17-digit VIN (e.g., 1HGCM82633A123456)"
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                setError('');
                setVehicleInfo(null);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={17}
            />
            <Button 
              onClick={handleVinLookup}
              disabled={loading || vin.length !== 17}
              className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2.5"
              size="default"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="sm:hidden">{loading ? 'Decoding VIN...' : 'Decode VIN'}</span>
              <span className="hidden sm:inline">{loading ? 'Decoding...' : 'Decode VIN'}</span>
            </Button>
          </div>

          {error && (
            <div className="flex items-start gap-3 text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 text-green-600 bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">{success}</span>
            </div>
          )}

          {/* Vehicle Information Display */}
          {vehicleInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2 text-base sm:text-lg">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                  Vehicle Information
                </h4>
                {user && !showSaveForm && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSaveForm(true)}
                    className="flex items-center gap-1 w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    Save to Garage
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="font-medium text-gray-600 block mb-1">Make:</span>
                  <p className="text-gray-900 font-semibold">{vehicleInfo.make}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="font-medium text-gray-600 block mb-1">Model:</span>
                  <p className="text-gray-900 font-semibold">{vehicleInfo.model}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="font-medium text-gray-600 block mb-1">Year:</span>
                  <p className="text-gray-900 font-semibold">{vehicleInfo.year}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="font-medium text-gray-600 block mb-1">Engine:</span>
                  <p className="text-gray-900 font-semibold text-xs sm:text-sm">{vehicleInfo.engine}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="font-medium text-gray-600 block mb-1">Transmission:</span>
                  <p className="text-gray-900 font-semibold text-xs sm:text-sm">{vehicleInfo.transmission}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <span className="font-medium text-gray-600 block mb-1">Fuel Type:</span>
                  <p className="text-gray-900 font-semibold">{vehicleInfo.fuelType}</p>
                </div>
              </div>

              {/* Save Vehicle Form */}
              {showSaveForm && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Nickname (optional)
                      </label>
                      <input
                        type="text"
                        placeholder={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <Button size="sm" onClick={saveVehicle} className="flex-1 sm:flex-none">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowSaveForm(false)} className="flex-1 sm:flex-none">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Vehicles */}
      {user && savedVehicles.length > 0 && (
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                My Garage 
                <span className="text-sm sm:text-base font-normal text-gray-500">({savedVehicles.length} vehicles)</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {savedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-200 active:bg-gray-100"
                  onClick={() => selectSavedVehicle(vehicle)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-gray-900 text-sm sm:text-base leading-tight pr-2">{vehicle.nickname}</h5>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedVehicle(vehicle.id);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-md flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="font-medium text-gray-800">{vehicle.vehicle_info.year} {vehicle.vehicle_info.make} {vehicle.vehicle_info.model}</p>
                    <p className="text-xs bg-gray-100 rounded px-2 py-1 font-mono">
                      VIN: <span className="font-semibold">{vehicle.vin}</span>
                    </p>
                    <p className="text-xs flex items-center gap-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      Added {new Date(vehicle.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
