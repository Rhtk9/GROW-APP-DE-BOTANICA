import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Registro } from '../model/registro.model';

@Injectable({ providedIn: 'root' })
export class RegistroService extends ApiService {

  listarTodos(): Observable<Registro[]> {
    return this.get<Registro[]>('registros');
  }

  listarPorPlanta(plantaUsuarioId: number): Observable<Registro[]> {
    return this.get<Registro[]>(`registros/planta/${plantaUsuarioId}`);
  }

  criar(registro: Registro): Observable<Registro> {
    return this.post<Registro>('registros', registro);
  }
}