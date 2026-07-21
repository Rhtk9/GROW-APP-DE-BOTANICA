// src/app/pages/minhas-plantas/minhas-plantas.page.ts
// src/app/pages/minhas-plantas/minhas-plantas.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { FaseService } from '../../services/fase.service';
import { EspecieFavoritaService } from '../../services/especie-favorita';
import { AuthService } from '../../core/services/auth.service';
import { PlantaUsuario } from '../../model/planta-usuario.model';
import { Registro } from '../../model/registro.model';
import { PlantaUsuarioService } from '../../services/planta-usuario';
import { RegistroService } from '../../services/registro';

@Component({
  selector: 'app-minhas-plantas',
  templateUrl: './minhas-plantas.page.html',
  styleUrls: ['./minhas-plantas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MinhasPlantasPage implements OnInit {
  plantas: PlantaUsuario[] = [];
  plantasFiltradas: PlantaUsuario[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  filtroAtivo: string = 'todas';
  filtros = [
    { id: 'todas', label: 'Todas' },
    { id: 'recentes', label: 'Recentes' },
    { id: 'favoritadas', label: 'Favoritadas' }
  ];

  // Estatísticas
  totalPlantas: number = 0;
  xpTotal: number = 0;
  nivelMedio: number = 0;

  // Últimos registros
  ultimosRegistros: Registro[] = [];
  carregandoRegistros: boolean = false;

  // Favoritos do usuário (cache)
  favoritosIds: number[] = [];

  constructor(
    private plantaService: PlantaUsuarioService,
    private registroService: RegistroService,
    private faseService: FaseService,
    private favoritoService: EspecieFavoritaService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarPlantas();
  }

  carregarPlantas() {
    this.loading = true;
    const usuario = this.authService.currentUser;
    if (!usuario || !usuario.id) {
      this.loading = false;
      this.mostrarAlerta('Aviso', 'Faça login para ver suas plantas.');
      return;
    }

    // Carregar favoritos do usuário primeiro (para cache)
    this.favoritoService.listarPorUsuario(usuario.id).subscribe({
      next: (favoritos) => {
        this.favoritosIds = favoritos.map(f => f.especieId);
      },
      error: () => {
        this.favoritosIds = [];
      }
    });

    this.plantaService.listarPorUsuario(usuario.id).subscribe({
      next: (plantas) => {
        this.plantas = plantas;
        this.calcularEstatisticas();
        this.carregarDetalhesFase(plantas);
        this.carregarUltimosRegistros(usuario.id!);
      },
      error: () => {
        this.loading = false;
        this.mostrarAlerta('Erro', 'Não foi possível carregar suas plantas.');
      }
    });
  }

  carregarDetalhesFase(plantas: PlantaUsuario[]) {
    let carregados = 0;
    const total = plantas.length;
    if (total === 0) {
      this.loading = false;
      this.aplicarFiltros();
      return;
    }

    plantas.forEach((planta) => {
      this.faseService.buscarPorId(planta.faseId).subscribe({
        next: (fase) => {
          planta.faseNome = fase.nome;
          carregados++;
          if (carregados === total) {
            this.loading = false;
            this.aplicarFiltros();
          }
        },
        error: () => {
          planta.faseNome = 'Fase ' + planta.faseId;
          carregados++;
          if (carregados === total) {
            this.loading = false;
            this.aplicarFiltros();
          }
        }
      });
    });
  }

  carregarUltimosRegistros(usuarioId: number) {
    this.carregandoRegistros = true;
    const plantasIds = this.plantas.map(p => p.id!).filter(id => id !== undefined);
    if (plantasIds.length === 0) {
      this.carregandoRegistros = false;
      return;
    }

    let registros: Registro[] = [];
    let concluidos = 0;
    plantasIds.forEach(id => {
      this.registroService.listarPorPlanta(id).subscribe({
        next: (regs) => {
          registros = registros.concat(regs);
          concluidos++;
          if (concluidos === plantasIds.length) {
            this.ultimosRegistros = registros
              .sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())
              .slice(0, 5);
            this.carregandoRegistros = false;
          }
        },
        error: () => {
          concluidos++;
          if (concluidos === plantasIds.length) {
            this.carregandoRegistros = false;
          }
        }
      });
    });
  }

  calcularEstatisticas() {
    this.totalPlantas = this.plantas.length;
    this.xpTotal = this.plantas.reduce((acc, p) => acc + (p.xpAtual || 0), 0);
    const niveis = this.plantas.map(p => p.nivel || 1);
    this.nivelMedio = niveis.length > 0 ? Math.round(niveis.reduce((a, b) => a + b, 0) / niveis.length) : 0;
  }

  aplicarFiltros() {
    let lista = [...this.plantas];

    // Busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      lista = lista.filter(p =>
        p.apelido.toLowerCase().includes(term) ||
        (p.especieNomePopular && p.especieNomePopular.toLowerCase().includes(term))
      );
    }

    // Filtros
    switch (this.filtroAtivo) {
      case 'recentes':
        lista.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
        break;
      case 'favoritadas':
        // Filtra apenas as plantas cuja espécie está na lista de favoritos do usuário
        lista = lista.filter(p => this.favoritosIds.includes(p.especieId));
        break;
      default: // 'todas'
        lista.sort((a, b) => (a.apelido || '').localeCompare(b.apelido || ''));
        break;
    }

    this.plantasFiltradas = lista;
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  setFiltro(filtro: string) {
    this.filtroAtivo = filtro;
    this.aplicarFiltros();
  }

  abrirPlanta(planta: PlantaUsuario) {
    this.router.navigate(['/cuidados-planta', planta.id]);
  }

  adicionarPlanta() {
    this.router.navigate(['/explorar-especies']);
  }

  getStatusIcon(planta: PlantaUsuario): string {
    const media = (planta.felicidade + planta.saude) / 2;
    if (media >= 80) return 'happy-outline';
    if (media >= 50) return 'ellipse-outline';
    return 'sad-outline';
  }

  getStatusColor(planta: PlantaUsuario): string {
    const media = (planta.felicidade + planta.saude) / 2;
    if (media >= 80) return '#2D6A4F';
    if (media >= 50) return '#F5A623';
    return '#d4183d';
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  getTempoRelativo(date: string): string {
    const agora = new Date();
    const data = new Date(date);
    const diff = Math.floor((agora.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 7) return `${diff} dias atrás`;
    return this.formatDate(date);
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}