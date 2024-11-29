import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface Type {
  id: number;
  name: string;
}

@Injectable()
export class TypesHttpService {
  private readonly deliveryServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.deliveryServiceUrl = this.configService.get<string>('DELIVERY_SERVICE_URL');
  }

  async getAllTypes(): Promise<Type[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Type[]>(`${this.deliveryServiceUrl}/api/v1/delivery/types`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch types from delivery service: ${error.message}`);
    }
  }
}