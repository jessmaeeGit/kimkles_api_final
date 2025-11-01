import { useState, useEffect, useCallback } from 'react';

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_KEY;
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';

export const useAddressAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🔧 Geoapify Hook initialized');
  console.log('🔑 API Key loaded:', GEOAPIFY_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('🌐 Base URL:', GEOAPIFY_BASE_URL);

  const searchAddresses = useCallback(async (query) => {
    console.log('🔍 Search triggered for:', query);

    if (!query || query.length < 3) {
      console.log('⏭️ Query too short, skipping search');
      setSuggestions([]);
      return;
    }

    if (!GEOAPIFY_API_KEY) {
      console.error('❌ API Key is missing!');
      setError('API Key is missing');
      return;
    }

    setLoading(true);
    setError(null);

    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `${GEOAPIFY_BASE_URL}/geocode/autocomplete?text=${encodedQuery}&apiKey=${GEOAPIFY_API_KEY}&limit=5&format=json`;

    console.log('🚀 Making API call to:', apiUrl);

    try {
      const response = await fetch(apiUrl);

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📦 Raw API response:', data);

      if (data.results && data.results.length > 0) {
        console.log('✅ Found results:', data.results.length);

        const formattedSuggestions = data.results.map((result, index) => {
          const formatted = {
            id: result.place_id || `result_${index}`,
            address: result.formatted || `${result.address_line1 || ''} ${result.city || ''}`.trim(),
            details: {
              street: result.address_line1 || '',
              city: result.city || result.town || result.village || '',
              state: result.state || '',
              country: result.country || '',
              postcode: result.postcode || '',
              coordinates: result.lon && result.lat ? {
                lng: parseFloat(result.lon),
                lat: parseFloat(result.lat)
              } : null
            }
          };
          console.log('🏠 Formatted suggestion:', formatted);
          return formatted;
        });

        setSuggestions(formattedSuggestions);
        console.log('📋 Final suggestions set:', formattedSuggestions.length);
      } else {
        console.log('📭 No results found in API response');
        setSuggestions([]);
      }
    } catch (err) {
      console.error('💥 Error searching addresses:', err);
      setError(err.message);
      setSuggestions([]);
    } finally {
      setLoading(false);
      console.log('🏁 Search completed');
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    console.log('🧹 Clearing suggestions');
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    searchAddresses,
    clearSuggestions
  };
};
