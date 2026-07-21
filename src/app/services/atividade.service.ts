// src/app/services/atividade.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Atividade } from '../model/atividade.model';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService extends ApiService {

  listarTodas(): Observable<Atividade[]> {
    return this.get<Atividade[]>('atividades');
  }

  listarPorTurma(turmaId: number): Observable<Atividade[]> {
    return this.get<Atividade[]>(`atividades/turma/${turmaId}`);
  }

  listarFuturasPorTurma(turmaId: number): Observable<Atividade[]> {
    return this.get<Atividade[]>(`atividades/turma/${turmaId}/futuras`);
  }

  listarPassadasPorTurma(turmaId: number): Observable<Atividade[]> {
    return this.get<Atividade[]>(`atividades/turma/${turmaId}/passadas`);
  }

  listarPorUsuario(usuarioId: number): Observable<Atividade[]> {
    return this.get<Atividade[]>(`atividades/usuario/${usuarioId}`);
  }

  buscarPorId(id: number): Observable<Atividade> {
    return this.getById<Atividade>('atividades', id);
  }

  criar(atividade: Atividade): Observable<Atividade> {
    return this.post<Atividade>('atividades', atividade);
  }

  atualizar(id: number, atividade: Atividade): Observable<Atividade> {
    return this.put<Atividade>('atividades', id, atividade);
  }

  atualizarStatus(id: number, status: string): Observable<Atividade> {
    return this.patch<Atividade>('atividades', id, { status });
  }

  excluir(id: number): Observable<void> {
    return this.delete<void>('atividades', id);
  }
}
