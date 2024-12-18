export interface LeafRecord {
    date: string
    diseaseId: string
    leafName: string
    diseaseName: string
    severity: 'Low' | 'Medium' | 'High'
    progress: 'Improving' | 'Stable' | 'Worsening' | 'New'
    location: string
    latitude?: number
    longitude?: number
    temperature?: number
    humidity?: number
    soilMoisture?: number
    lightIntensity?: number
  }
  
  