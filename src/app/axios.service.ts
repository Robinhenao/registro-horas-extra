import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: 'http://localhost:5007/api', // Reemplaza con la URL base de tu API
      timeout: 10000, // Tiempo de espera en milisegundos
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Interceptor para manejar tokens de autenticación
    this.axiosClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public async get(url: string, config = {}) {
    return this.axiosClient.get(url, config);
  }

  public async post(url: string, data: any, config = {}) {
    return this.axiosClient.post(url, data, config);
  }

  public async put(url: string, data: any, config = {}) {
    return this.axiosClient.put(url, data, config);
  }

  public async delete(url: string, config = {}) {
    return this.axiosClient.delete(url, config);
  }
}