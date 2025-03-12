import { useEffect, useState } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Config } from '../payload-types'

interface ChartDataParams {
  id: string
  collection?: keyof Config['collections']
}

interface ChartDataResponse<T = any> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export const useChartData = <T = any>({ id, collection }: ChartDataParams): ChartDataResponse<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!collection) {
        setIsLoading(false)
        return
      }

      try {
        const payload = await getPayload({ config: configPromise })
        const response = await payload.find({
          collection: collection,
          depth: 1,
        })

        const transformedData = transformChartData<T>(response.docs, id)
        setData(transformedData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [collection, id])

  return { data, isLoading, error }
}

function transformChartData<T>(data: any[], widgetId: string): T {
  // Implementiere die Datentransformation basierend auf dem Widget-Typ
  // Return transformed data structure
  return data as T
}