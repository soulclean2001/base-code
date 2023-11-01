import { ApiResponse } from '~/types'
import client from './client'

export class Upload {
  public static uploadImage = async (data: any) => {
    const rs: ApiResponse = await client.post(`/medias/upload-image`, data)
    return rs
  }
  public static uploadPDF = async (data: any) => {
    const rs: ApiResponse = await client.post(`/medias/upload-pdf`, data)
    return rs
  }
}

export default Upload
