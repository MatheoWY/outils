import { nicokaApi } from './nicokaApi';

// Test pour vérifier les endpoints disponibles
export async function testNicokaEndpoints() {
  console.log('=== TEST NICOKA ENDPOINTS ===');
  
  const endpoints = [
    // Module Recrutement
    '/recrutement/candidature',
    '/recrutement/candidat',
    '/recrutement/job',
    '/recrutement/action',
    // Alternatives
    '/candidature',
    '/candidat',
    '/job',
    // Autres modules pour tester si l'API fonctionne
    '/crm/contact',
    '/crm/compte',
    '/sirh/collaborateur',
  ];

  for (const endpoint of endpoints) {
    try {
      await nicokaApi.ensureAuthenticated();
      const token = nicokaApi.getToken();
      const baseUrl = nicokaApi.getBaseUrl();
      
      const url = `${baseUrl}${endpoint}`;
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`  → Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  → ✅ SUCCESS! Data:`, data);
      } else {
        const errorText = await response.text();
        console.log(`  → ❌ Error response:`, errorText);
      }
    } catch (error) {
      console.log(`  → ❌ Error:`, error);
    }
  }
  
  console.log('=========================');
}

