// src/app/core/services/auth.service.ts
// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../model/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Inicializa o estado do serviço lendo as informações persistidas no localStorage
    this.carregarDadosArmazenados();
  }

  // Getter síncrono para obter o usuário atual
  get currentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Getter síncrono para obter o token atual
  get token(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Realiza o login consumindo a API real no Spring Boot
   */
  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(
        tap(res => {
          // Salva as credenciais no armazenamento físico do navegador
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.usuario));

          // Atualiza os Subjects para que toda a aplicação reaja ao novo login
          this.tokenSubject.next(res.token);
          this.currentUserSubject.next(res.usuario);
        }),
        catchError((error: any) => {
          console.error('Erro no fluxo de autenticação:', error);
          return throwError(() => new Error(error.error?.message || 'Email ou senha incorretos'));
        })
      );
  }

  /**
   * Registra um novo usuário no sistema
   */
  cadastrar(usuario: Usuario): Observable<Usuario> {
    const { id, ...dadosCadastro } = usuario;
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, dadosCadastro)
      .pipe(
        catchError((error: any) => {
          console.error('Erro ao registrar usuário:', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao criar conta. Tente novamente.'));
        })
      );
  }

  /**
   * Finaliza a sessão do usuário limpando o localStorage e os states do RxJS
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Valida de forma rápida se existe uma sessão ativa
   */
  isLoggedIn(): boolean {
    return !!this.tokenSubject.value && !!this.currentUserSubject.value;
  }

  /**
   * Recupera o estado de autenticação guardado para persistir o login mesmo atualizando a página
   */
  private carregarDadosArmazenados(): void {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');

    if (token) {
      this.tokenSubject.next(token);
    }

    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao ler dados do usuário do localStorage', e);
        this.logout();
      }
    }
  }
}