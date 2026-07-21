// src/app/services/especie-favorita.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';

export interface EspecieFavorita {
  id?: number;
  usuarioId: number;
  especieId: number;
  dataFavorito?: string;
}

@Injectable({ providedIn: 'root' })
export class EspecieFavoritaService extends ApiService {
  listarTodos(): Observable<EspecieFavorita[]> {
    throw new Error('Method not implemented.');
  }

  listarPorUsuario(usuarioId: number): Observable<EspecieFavorita[]> {
    return this.get<EspecieFavorita[]>(`favoritos/usuario/${usuarioId}`);
  }

  favoritar(usuarioId: number, especieId: number): Observable<any> {
    return this.post<any>('favoritos', { usuarioId, especieId });
  }

  desfavoritar(usuarioId: number, especieId: number): Observable<any> {
    return this.deleteWithUrl<any>(`favoritos/usuario/${usuarioId}/especie/${especieId}`);
  }
}