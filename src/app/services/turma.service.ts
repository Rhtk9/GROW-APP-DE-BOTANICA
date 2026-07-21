// src/app/services/turma.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Turma } from '../model/turma.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService extends ApiService {

  listarTodas(): Observable<Turma[]> {
    return this.get<Turma[]>('turmas');
  }

  listarPorDisciplina(disciplinaId: number): Observable<Turma[]> {
    return this.get<Turma[]>(`turmas/disciplina/${disciplinaId}`);
  }

  listarPorUsuario(usuarioId: number): Observable<Turma[]> {
    return this.get<Turma[]>(`turmas/usuario/${usuarioId}`);
  }

  buscarPorId(id: number): Observable<Turma> {
    return this.getById<Turma>('turmas', id);
  }

  criar(turma: Turma): Observable<Turma> {
    return this.post<Turma>('turmas', turma);
  }

  atualizar(id: number, turma: Turma): Observable<Turma> {
    return this.put<Turma>('turmas', id, turma);
  }

  excluir(id: number): Observable<void> {
    return this.delete<void>('turmas', id);
  }
}