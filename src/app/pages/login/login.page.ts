// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../model/usuario.model';
import { AuthService } from '../../core/services/auth.service';

// Importações explícitas dos componentes standalone do Ionic que estão no seu HTML
import { 
  IonContent, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonSpinner 
} from '@ionic/angular/standalone';

// Importação e registro manual dos ícones do Ionicons para rodar em modo Standalone
import { addIcons } from 'ionicons';
import { 
  checkmarkCircleOutline, 
  leafOutline, 
  personOutline, 
  calendarOutline, 
  mailOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline, 
  arrowForwardOutline, 
  alertCircleOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonSpinner
  ]
})
export class LoginPage {
  isRegisterMode = false;
  showPassword = false;
  loading = false;
  authError = '';
  emailTouched = false;
  senhaTouched = false;

  usuario: Usuario = this.inicializarUsuario();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Registra todos os ícones usados no HTML para garantir que renderizem corretamente
    addIcons({
      checkmarkCircleOutline,
      leafOutline,
      personOutline,
      calendarOutline,
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      arrowForwardOutline,
      alertCircleOutline
    });
  }

  inicializarUsuario(): Usuario {
    return {
      nome: '',
      email: '',
      senha: '',
      dataNascimento: '',
      tema: 1,
      idioma: 1,
      notificacoes: true,
      som: true
    };
  }

  setMode(mode: string) {
    this.isRegisterMode = mode === 'register';
    this.authError = '';
    this.usuario = this.inicializarUsuario();
    this.emailTouched = false;
    this.senhaTouched = false;
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.authError = '';
    this.usuario = this.inicializarUsuario();
    this.emailTouched = false;
    this.senhaTouched = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onSubmit() {
    this.authError = '';

    if (this.isRegisterMode) {
      this.executarCadastro();
    } else {
      this.executarLogin();
    }
  }

  private executarLogin() {
    if (!this.usuario.email || !this.usuario.senha) {
      this.authError = 'Preencha email e senha.';
      return;
    }

    this.loading = true;
    this.authService.login(this.usuario.email, this.usuario.senha).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']); // Navega para a sua rota protegida
      },
      error: (err) => {
        this.loading = false;
        this.authError = err.message || 'Email ou senha inválidos.';
      }
    });
  }

  private executarCadastro() {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha || !this.usuario.dataNascimento) {
      this.authError = 'Preencha todos os campos obrigatórios.';
      return;
    }
    if (this.usuario.senha.length < 6) {
      this.authError = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }
    if (!this.isValidEmail(this.usuario.email)) {
      this.authError = 'Email inválido.';
      return;
    }

    this.loading = true;
    this.authService.cadastrar(this.usuario).subscribe({
      next: (user) => {
        console.log('Cadastro realizado com sucesso:', user);
        this.loading = false;
        this.setMode('login'); // Retorna ao modo de login após o sucesso
      },
      error: (err) => {
        this.loading = false;
        this.authError = err.message || 'Erro ao criar conta. Tente novamente.';
      }
    });
  }

  onForgotPassword() {
    // Implementação de recuperação de senha futura
  }

  onGoogleLogin() {
    // Implementação de login social futura
  }
}