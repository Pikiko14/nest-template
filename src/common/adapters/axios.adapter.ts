import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  post<T>(url: string, data: any): Promise<T> {
    console.log(url, data);
    throw new Error('Method not implemented.');
  }
  put<T>(url: string, data: any): Promise<T> {
    console.log(url, data);
    throw new Error('Method not implemented.');
  }
  delete<T>(url: string): Promise<T> {
    console.log(url);
    throw new Error('Method not implemented.');
  }
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error('Method not implemented.');
    }
  }
}
