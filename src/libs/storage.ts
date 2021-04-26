import AsyncStorage from '@react-native-async-storage/async-storage'
import {format} from 'date-fns'

export interface PlantItem {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  };
  dateTimeNotification: Date
  hour: string
};

export interface StoragePlantItem {
  [id: string]: {
    data: PlantItem
  }
}

export async function plantSave(plant: PlantItem): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const oldPlants = data ? (JSON.parse(data) as StoragePlantItem) : {}

    const newPlant = {
      [plant.id]: {
        data: plant
      }
    }
    await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify({
      ...newPlant,
      ...oldPlants
    }))
  } catch(e) {
    throw new Error(e)
  }
}

export async function loadPlant(): Promise<PlantItem[]> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const storagePlants = data ? (JSON.parse(data) as StoragePlantItem) : {}
    const plants = Object
      .keys(storagePlants)
      .map(key => {
        const {data} = storagePlants[key]
        const {dateTimeNotification} = data

        return {
          ...storagePlants[key].data,
          hour: dateTimeNotification ? 
          format(new Date(dateTimeNotification), "HH:mm") : 
          format(new Date(), "HH:mm")
        }
      }).sort((a, b) => {
        const dateA = Math.floor(new Date(a.dateTimeNotification).getTime()) / 1000
        const dateB = Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)

        return dateA - dateB
      })

    return plants
  } catch(e) {
    throw new Error(e)
  }
}