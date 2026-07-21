// src/app/services/usuario-turma.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { UsuarioTurma } from '../model/usuario-turma.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioTurmaService extends ApiService {

  listarTodos(): Observable<UsuarioTurma[]> {
    return this.get<UsuarioTurma[]>('usuarios-turmas');
  }

  listarPorUsuario(usuarioId: number): Observable<UsuarioTurma[]> {
    return this.get<UsuarioTurma[]>(`usuarios-turmas/usuario/${usuarioId}`);
  }

  listarPorTurma(turmaId: number): Observable<UsuarioTurma[]> {
    return this.get<UsuarioTurma[]>(`usuarios-turmas/turma/${turmaId}`);
  }

  listarAtivos(): Observable<UsuarioTurma[]> {
    return this.get<UsuarioTurma[]>('usuarios-turmas/ativos');
  }

  listarFavoritos(): Observable<UsuarioTurma[]> {
    return this.get<UsuarioTurma[]>('usuarios-turmas/favoritos');
  }

  buscarPorId(id: number): Observable<UsuarioTurma> {
    return this.getById<UsuarioTurma>('usuarios-turmas', id);
  }

  criar(usuarioTurma: UsuarioTurma): Observable<UsuarioTurma> {
    return this.post<UsuarioTurma>('usuarios-turmas', usuarioTurma);
  }

  atualizar(id: number, usuarioTurma: UsuarioTurma): Observable<UsuarioTurma> {
    return this.put<UsuarioTurma>('usuarios-turmas', id, usuarioTurma);
  }

  ativarDesativar(id: number, ativo: boolean): Observable<UsuarioTurma> {
    return this.patch<UsuarioTurma>('usuarios-turmas', id, { ativo });
  }

  favoritarDesfavoritar(id: number, favorito: boolean): Observable<UsuarioTurma> {
    return this.patch<UsuarioTurma>('usuarios-turmas', id, { favorito });
  }

  excluir(id: number): Observable<void> {
    return this.delete<void>('usuarios-turmas', id);
  }
}