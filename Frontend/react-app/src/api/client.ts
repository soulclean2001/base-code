/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'
import { EnhancedStore } from '@reduxjs/toolkit'
import Auth from './auth.api'
import { logout, setToken } from '~/features/Auth/authSlice'

let store: EnhancedStore
export const cancelTokenSource = axios.CancelToken.source()
interface AuthResponse {
  message: string
  result: {
    access_token: string
    refresh_token: string
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  timeout: 1000,
  headers: {
    'content-type': 'application/json'
  }
})

export const injectStore = (_store: EnhancedStore) => {
  store = _store
}

instance.interceptors.request.use(async (config) => {
  const accessToken = store.getState().auth.accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

const responseInterceptorId = instance.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }

    return response
  },
  async (error) => {
    const refreshToken = store.getState().auth.refreshToken
    if (error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (responseInterceptorId) axios.interceptors.response.eject(responseInterceptorId)

    return Auth.refreshToken(refreshToken)
      .then((response) => {
        const data = response as AuthResponse
        const { access_token, refresh_token } = data.result
        store.dispatch(setToken({ accessToken: access_token, refreshToken: refresh_token }))
        error.response.config.headers['Authorization'] = 'Bearer ' + access_token
        error.response.config.refreshed = true
        return instance(error.response.config)
      })
      .catch((error) => {
        store.dispatch(logout())

        if (error.response && error.response.data && error.response.data.message) {
          const data = error.response.data
          console.log(data)

          return Promise.reject(data) // Thông điệp lỗi từ server (dưới dạng JSON)
        }

        return Promise.reject(error)
      })
      .finally()
  }
)
export default instance