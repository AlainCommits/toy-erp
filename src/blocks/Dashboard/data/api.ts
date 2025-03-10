/**
 * API-Funktionen für das Dashboard
 * 
 * Dieses Modul bietet Funktionen zum Abrufen von Dashboard-Daten über verschiedene APIs:
 * - Local API: Direkte Datenbankzugriffe (serverside)
 * - REST API: HTTP-Anfragen für Client-Komponenten
 * - GraphQL API: Strukturierte Datenabfragen (optional)
 */

import type { SalesData, InventoryData, CustomersData, SuppliersData } from '../types';
import { headers } from 'next/headers';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Prüft, ob der Code im Client oder Server ausgeführt wird
 */
export const isClient = typeof window !== 'undefined';
export const isServer = !isClient;

/**
 * Holt den API-Token je nach Ausführungskontext (Client/Server)
 */
export function getApiToken(): string | null {
  // Client: Token aus localStorage oder Cookie holen
  if (isClient) {
    return localStorage.getItem('payload-token') || 
           document.cookie.match(/payload-token=([^;]+)/)?.[1] || 
           null;
  } 
  
  // Server: Warnung ausgeben - verwende stattdessen getServerApiToken()
  console.warn('getApiToken() wurde auf dem Server aufgerufen - verwende getServerApiToken() stattdessen');
  return null;
}

/**
 * Server-spezifische Funktion um Token aus Headers zu holen
 * Diese Funktion muss mit await verwendet werden!
 */
export async function getServerApiToken(): Promise<string | null> {
  if (isClient) return null;
  
  try {
    // headers() gibt eine Promise zurück, daher muss await verwendet werden!
    const { cookies } = await import('next/headers');
    // Das await hier ist entscheidend!
    const cookieStore = await cookies();
    const payloadToken = cookieStore.get('payload-token')?.value;
    return payloadToken || null;
  } catch (error) {
    console.error('Error getting server API token:', error);
    return null;
  }
}

/**
 * Baut eine API-URL mit Filtern
 */
function buildApiUrl(collection: string, filters: Record<string, any> = {}): string {
  // Verbesserte URL-Konstruktion mit Fehlerbehandlung
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isClient ? window.location.origin : '');
  
  try {
    const url = new URL(`${baseUrl}/api/${collection}`);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([operator, operatorValue]) => {
          url.searchParams.append(`where[${key}][${operator}]`, String(operatorValue));
        });
      } else {
        url.searchParams.append(`where[${key}]`, String(value));
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error('Invalid URL:', error);
    // Fallback bei ungültiger URL
    return `${baseUrl}/api/${collection}`;
  }
}

/**
 * Holt Verkaufsdaten über REST API (Client-seitig)
 */
export async function fetchSalesDataClient(startDate: Date, endDate: Date): Promise<SalesData> {
  try {
    // Prüfe zuerst Revenue-Collection
    const revenueUrl = buildApiUrl('revenue', {
      period: {
        greater_than_equal: startDate.toISOString(),
        less_than_equal: endDate.toISOString(),
      }
    });
    
    const token = getApiToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }
    
    const response = await fetch(revenueUrl, { headers });
    
    if (response.ok) {
      const data = await response.json();
      return processRevenueData(data);
    }
    
    // Fallback zu Orders, wenn keine Revenue-Daten vorhanden
    const ordersUrl = buildApiUrl('orders', {
      orderDate: {
        greater_than_equal: startDate.toISOString(),
        less_than_equal: endDate.toISOString(),
      }
    });
    
    const ordersResponse = await fetch(ordersUrl, { headers });
    
    if (ordersResponse.ok) {
      const data = await ordersResponse.json();
      return processOrdersData(data);
    }
    
    // Wenn nichts gefunden wurde, gib Demo-Daten zurück
    return getDemoSalesData();
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return getDemoSalesData();
  }
}

/**
 * GraphQL API Beispiel für komplexere Datenabfragen
 */
export async function fetchDashboardDataGraphQL() {
  try {
    const token = getApiToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    const query = `
      query DashboardData($startDate: String!, $endDate: String!) {
        Revenue(where: { 
          period: { 
            greater_than_equal: $startDate, 
            less_than_equal: $endDate 
          }
        }) {
          docs {
            period
            amount
            profit
          }
        }
        Inventory {
          docs {
            id
            product {
              name
              categories {
                category
              }
            }
            quantity
            minStockLevel
          }
          totalDocs
        }
        Customers {
          docs {
            customerType
            createdAt
          }
          totalDocs
        }
      }
    `;
    
    const variables = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Tage zurück
      endDate: new Date().toISOString(),
    };
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `JWT ${token}`;
    }
    
    const response = await fetch(`${baseUrl}/api/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('GraphQL Error:', error);
    return null;
  }
}

// Hilfsfunktionen zur Datenverarbeitung
// Vollständige Implementierung statt Platzhalter
function processRevenueData(data: any): SalesData {
  if (!data || !data.docs || !Array.isArray(data.docs)) {
    return getDemoSalesData();
  }
  
  try {
    // Group by period for the chart data
    const revenueByPeriod = data.docs.reduce((acc: Record<string, any>, item: any) => {
      if (!item.period) return acc;
      
      const periodDate = new Date(item.period);
      const periodKey = format(periodDate, 'MMM', { locale: de });
      
      if (!acc[periodKey]) {
        acc[periodKey] = { period: periodKey, revenue: 0, profit: 0 };
      }
      
      acc[periodKey].revenue += typeof item.amount === 'number' ? item.amount : 0;
      acc[periodKey].profit += typeof item.profit === 'number' ? item.profit : 
                            (typeof item.amount === 'number' ? item.amount * 0.4 : 0);
      
      return acc;
    }, {});
    
    const totalRevenue = data.docs.reduce(
      (sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 
      0
    );
    
    return {
      byPeriod: Object.values(revenueByPeriod),
      totalRevenue
    };
  } catch (error) {
    console.error('Error processing revenue data:', error);
    return getDemoSalesData();
  }
}

function processOrdersData(data: any): SalesData {
  if (!data || !data.docs || !Array.isArray(data.docs)) {
    return getDemoSalesData();
  }
  
  try {
    const orderData = data.docs.map((order: any) => {
      const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
      const total = typeof order.total === 'number' ? order.total : 0;
      
      return {
        period: format(orderDate, 'MMM', { locale: de }),
        revenue: total,
        profit: total * 0.4 // Geschätzte Gewinnmarge
      };
    });
    
    const salesByPeriod = orderData.reduce((acc: any[], item: any) => {
      const existingPeriod = acc.find(p => p.period === item.period);
      if (existingPeriod) {
        existingPeriod.revenue += item.revenue;
        existingPeriod.profit += item.profit;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
    
    const totalRevenue = data.docs.reduce(
      (sum: number, order: any) => sum + (typeof order.total === 'number' ? order.total : 0), 
      0
    );
    
    return {
      byPeriod: salesByPeriod,
      totalRevenue
    };
  } catch (error) {
    console.error('Error processing orders data:', error);
    return getDemoSalesData();
  }
}

function getDemoSalesData(): SalesData {
  return {
    byPeriod: [
      { period: 'Jan', revenue: 45000, profit: 18000 },
      { period: 'Feb', revenue: 52000, profit: 20800 },
      { period: 'Mar', revenue: 49000, profit: 19600 },
      { period: 'Apr', revenue: 58000, profit: 23200 },
      { period: 'Mai', revenue: 63000, profit: 25200 },
      { period: 'Jun', revenue: 59000, profit: 23600 },
    ],
    totalRevenue: 326000
  };
}
