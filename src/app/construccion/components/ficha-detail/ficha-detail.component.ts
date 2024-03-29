import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { customEmailValidator, validationErrors } from 'src/app/shared/helpers/custom-validators';
import { fichasParser } from 'src/app/shared/helpers/parsers';
import { MapaAprendizajeComponent } from '../mapa-aprendizaje/mapa-aprendizaje.component';
import { EstrategiasMetodologicasComponent } from '../estrategias-metodologicas/estrategias-metodologicas.component';
import { GuiaEvaluacionComponent } from '../guia-evaluacion/guia-evaluacion.component';
import { ConstruccionService } from '../../services/construccion.service';
import { RejectionReasonModalComponent } from './components/rejection-reason-modal/rejection-reason-modal.component';

@Component({
  selector: 'app-ficha-detail',
  templateUrl: './ficha-detail.component.html',
  styleUrls: ['./ficha-detail.component.scss'],
})
export class FichaDetailComponent implements OnInit {
  flagInfo: boolean;
  fichaID: number;
  selectedFicha: any | null;
  mixedList = {};
  mapasAprendizaje: Array<any> = [];
  estrategiasMetodologicas: Array<any> = [];
  guiasEvaluacion: Array<any> = [];
  currentUserType: any = {};
  fichas: Array<any> = [];
  tiposUc: Array<any> = ['Básica/Comun','Transversal/Genérica','Específica/Técnica'];
  modalidadesFormarcion: Array<any> = ['Mixta','Presencial','Virtual','A distancia'];
  nivelDominio: Array<any> = [
    'Nivel I. Desempeño rutinario.',
    'Nivel II. Desempeño autónomo.',
    'Nivel III. Desempeño de transferencia.',
    'Nivel IV. Desempeño intuitivo.'
  ];
  horasFormacion = [
    40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110,
    115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175,
    180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240
  ];
  areaDeConocimiento = {};
  areaOcupacional = {};
  subAreaOcupacional = {};
  public fichaDetailForm: FormGroup;
  public mapForm: FormGroup;
  public resourcesAndSpacesForm: FormGroup;
  public colectiveTableForm: FormGroup;
  public digitalResourcesForm: FormGroup;
  actualSegment= 'Ficha resumen de la unidad curricular';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    private construccionService: ConstruccionService,
  ) { }

  ngOnInit() {
    const strFichaIndex = this.route.snapshot.paramMap.get('fichaID');
    this.fichaID = Number(strFichaIndex);
    this.currentUserType = JSON.parse(localStorage.getItem('currentSession') || '{}');
    this.construccionService.getFichasResumen().subscribe();
    this.construccionService.unidadesCurriculares$.subscribe(data =>{
      if(data !== undefined){
        const cleanedData = fichasParser(data);
        this.fichas= cleanedData;
        const findedFicha = cleanedData.find(el => el.id === this.fichaID);
        if(findedFicha){
          this.selectedFicha = findedFicha;
        }
      }
    });
    this.areaDeConocimiento = this.construccionService.areaDeConocimiento;
    this.areaOcupacional = this.construccionService.areaOcupacional;
    this.subAreaOcupacional = this.construccionService.subAreaOcupacional;
    this.setupForm();
  }
  areasConocimiento(){
    console.log(Object.entries(this.areaDeConocimiento));
    return Object.entries(this.areaDeConocimiento);
  }

  subAreasOcupacionales(){
    return Object.entries(this.subAreaOcupacional);
  }

  areasOcupacionales(){
    return Object.entries(this.areaOcupacional);
  }

  setupForm() {
    this.fichaDetailForm = this.formBuilder.group({
      // areaOcupacional: ['Ciencias Físicas'],
      // subAreaOcupacional: ['Física'],
      // areaConocimiento: ['Ciencias naturales, matemática y estadística '],
      // uc: ['Física Básica'],
      // codigoUc: ['No asignado'],
      // totalHorasFormacion: [48],
      // tipoUc: ['Básica/Común'],
      // modalidadFormacion: ['Mixta'],
      // proposito: [`Formar a los participantes y las participantes con conocimientos habilidades, destrezas y competencias en magnitudes,
      // sistema métrico legal, mecánica, movimiento rectilíneo uniforme, unidades de calor y leyes de newton,
      // para aplicar en el área de electromecánica,a fin de un desempeño eficiente, con base a las leyes de la física,
      // cumpliendo con las medidas preventivas integrales y preservando el ambiente`],
      // dirigidoA: [['Aprendices', 'Bachilleres o estudiantes del 3er año de bachillerato', 'Servidores públicos',
      //   'Estudiantes universitarios', 'Público en general']],
      // nivelDominioEsperado: [['Nivel II', 'Desempeño Autónomo']],
      // sinopsis: [`Estamos viviendo un tiempo acelerado principalmente en la educación, en la sociedad y en el mundo del trabajo;
      // es allí donde surge la necesidad
      //  en el ámbito educativo laboral de actualizar los conocimientos, cualidades y cualificaciones,
      //  siendo esto una demanda en la evolución profesional, partiendo desde los pilares fundamentales de la educación aprender a conocer,
      //  aprender hacer, aprender a vivir juntos y aprender a ser; para así lograr un desempeño de calidad desde lo humano,
      //  durante la aplicación de los conocimientos de física básica en la electromecánica industrial. Es fundamental fortalecer
      //  las habilidades y destrezas de cada uno de los y las participantes interesados en optimizar la productividad,
      //  competitividad y así promover el progreso profesional. Es esencial que exista una formación profesional continua en
      //  cualquier ámbito profesional además de estar al día en cuanto a conocimientos y tener la capacidad de hacer frente a situaciones
      //  que demandan atención y concentración, en medio de esto existe un propósito crear metas y objetivos claros para mejorar
      //  y superarse a sí mismo.`],
      // ejesTransversales: [['Valores éticos', 'Trabajo productivo, cooperativo y liberador', 'Tecnologías libres',
      //   'Protección y conservación del ambiente', 'Seguridad y salud en el trabajo']],
      // perfilFacilitador: [['Conocedor del estado del arte en el área de Física.',
      //   'Tres años (mínimo) de experiencia en el desempeño de la ocupación']],
      // perfilGenericoIngreso: [['Mayor de 14 años de edad', 'Conocimientos en:', 'Matemática Básica']],
      // perfilEgreso: [[`Utiliza el sistema de medición para una eficiente conversión científica de unidades que permitan la
      // fabricación óptima de piezas, aplicando las magnitudes escalares y vectoriales para la proyección en el plano tridimensional,
      // siguiendo los procedimiento técnico y respetando las leyes de la física, tomando en cuenta las medidas preventivas
      // integrales y protección ambiental.`,`dentifica los diferentes tipos de movimientos, dinámica y lanzamientos para trazar líneas,
      // parábolas, círculos y elipses en el plano tridimensional para construir piezas, siguiendo el procedimiento técnico y respetando
      // las leyes de las físicas tomando en cuenta las medidas preventivas integrales y ambiental.`,`Describe las máquinas de acuerdo a sus
      // características y aplicación en la construcción de piezas, siguiendo el procedimiento técnico y tomando en cuenta las medidas
      // preventivas integrales y protección ambiental.`,`Aplica las características de la transferencia de calor para observar la escala
      // de temperatura, las unidades y el calor especifico , siguiendo el procedimiento técnico y tomando en cuenta las medidas
      // preventivas integrales y protección ambiental.`]],
      // consideracionesPerfilGenerico: ['Manejo de aplicaciones e Internet']
      id:[this.fichaID !== 0 ? this.selectedFicha.id :null],
      state:[this.fichaID !== 0 ? this.selectedFicha.state :null],
      areaOcupacional: [this.fichaID !== 0 ? this.selectedFicha.areaOcupacional :null],
      subAreaOcupacional: [this.fichaID !== 0 ? this.selectedFicha.subAreaOcupacional : null],
      areaConocimiento: [this.fichaID !== 0 ? this.selectedFicha.areaConocimiento : null],
      uc: [this.fichaID !== 0 ? this.selectedFicha.uc : null],
      codigoUC: [this.fichaID !== 0 ? this.selectedFicha.codigoUC : 'No asignado'],
      totalHorasFormacion: [this.fichaID !== 0 ? this.selectedFicha.totalHorasFormacion : null],
      tipoUc: [this.fichaID !== 0 ? this.selectedFicha.tipoUc : null],
      modalidadFormacion: [this.fichaID !== 0 ? this.selectedFicha.modalidadFormacion : null],
      proposito: [this.fichaID !== 0 ? this.selectedFicha.proposito : null],
      dirigidoA: [this.fichaID !== 0 ? this.selectedFicha.dirigidoA : null],
      nivelDominioEsperado: [this.fichaID !== 0 ? this.selectedFicha.nivelDominioEsperado : null],
      sinopsis: [this.fichaID !== 0 ? this.selectedFicha.sinopsis : null],
      ejesTransversales: [this.fichaID !== 0 ? this.selectedFicha.ejesTransversales : null],
      perfilFacilitador: [this.fichaID !== 0 ? this.selectedFicha.perfilFacilitador : null],
      perfilGenericoIngreso: [this.fichaID !== 0 ? this.selectedFicha.perfilGenericoIngreso : null],
      perfilEgreso: [this.fichaID !== 0 ? this.selectedFicha.perfilEgreso : null],
      consideracionesPerfilGenerico: [this.fichaID !== 0 ? this.selectedFicha.consideraciones_perfil_ingreso : null],

    });
    this.mapForm = this.formBuilder.group({
      logroParticipante: [this.fichaID !== 0 ? this.selectedFicha : null],
      horasPracticas:[this.fichaID !== 0 ? this.selectedFicha : null],
      horasTeoricas:[this.fichaID !== 0 ? this.selectedFicha : null],
      ejesTematicos:[this.fichaID !== 0 ? this.selectedFicha : null],
      observacionDirecta:[this.fichaID !== 0 ? this.selectedFicha : null],
      producto:[this.fichaID !== 0 ? this.selectedFicha : null],
      conocimiento:[this.fichaID !== 0 ? this.selectedFicha : null]
    });
    this.resourcesAndSpacesForm = this.formBuilder.group({
      numeroParticipantes:[this.fichaID !== 0 ? this.selectedFicha : null],
    });
    //this.colectiveTableForm = this.formBuilder.group({});
    //this.digitalResourcesForm = this.formBuilder.group({});
  }

  pushList(formKey: string,event: any, field: string){
    console.log(event.target.value);
    const userInput = event.target.value;
    if(userInput !== ''){
      this.mixedList[field] = Array.isArray(this.mixedList[field]) ?
      this.mixedList[field] = [...this.mixedList[field],userInput] : this.mixedList[field] = [userInput];
      this[formKey].controls[field].setValue('');

    }
  }
  back() {
    this.router.navigate(['construccion/']);
  }
  segmentButton(event?: any) {
    const value = event.detail.value;
    const segmentValues = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Ficha resumen de la unidad curricular': 'Ficha resumen de la unidad curricular',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Mapa de aprendizaje': 'Mapa de aprendizaje',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Recursos y espacios de formación y autoformación productiva': 'Recursos y espacios de formación y autoformación productiva',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Colectivo de la mesa de evaluación, construcción y desarrollo curricular permanente':
      'Colectivo de la mesa de evaluación, construcción y desarrollo curricular permanente',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Recursos educativos digitales': 'Recursos educativos digitales',
    };
    this.actualSegment = segmentValues[value];
  }
  showErrors(control: string) {
    const err = { ...this.fichaDetailForm.controls[control].errors };
    const errors = Object.keys(err);
    return validationErrors[errors[0]];
  }
  replaced(subType: string){
    const copy = subType;
    return copy.replace(/_[0-9]/,'');
  }
  objKeys(mappingObj: any) {
    return Object.keys(mappingObj);
  }
  async newMapaAdrendizaje(mapaAprendizaje: any, index?: number){
    const modal = await this.modalController.create({
      component: MapaAprendizajeComponent,
      componentProps:{
        numeration:index? index: this.mapasAprendizaje.length + 1,
        mapaAprendizaje
      },
      showBackdrop: true,
      cssClass: ['modal-xxl', 'backdrop'],
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined && data !== null) {
      console.log('la data del modal es: ',data);
      if(index){
        this.mapasAprendizaje[index] = data;
      } else{
        this.mapasAprendizaje.push(data);
      }
    }
  }
  async newEstrategiaMetodologica(index: number, estrategiaMetodologica: any){
    const modal = await this.modalController.create({
      component: EstrategiasMetodologicasComponent,
      componentProps:{
        estrategiaMetodologica
        // numeration:this.mapasAprendizaje.length + 1
      },
      showBackdrop: true,
      cssClass: ['modal-xxl', 'backdrop'],
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined && data !== null) {
      console.log('la data del modal es: ',data);
      if(estrategiaMetodologica !== null){
        this.estrategiasMetodologicas[index] = data;
      } else{
        this.estrategiasMetodologicas.push(data);
      }
    }
  }
  async newGuiaDeEvaluacion(index: number,guiaEvaluacion: any){
    const modal = await this.modalController.create({
      component: GuiaEvaluacionComponent,
      componentProps:{
         numeration:index + 1,
         guiaEvaluacion
      },
      showBackdrop: true,
      cssClass: ['modal-xxl', 'backdrop'],
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined && data !== null) {
      console.log('la data del modal es: ',data);
      if(guiaEvaluacion !== null){
        this.guiasEvaluacion[index] = data;
      } else{
        this.guiasEvaluacion.push(data);
      }
    }
  }
  async presentToast(backMsg: string) {
    const toast = await this.toastController.create({
      message: backMsg,
      icon: 'checkmark-circle',
      position: 'bottom',
      color: 'success',
      duration: 2500,
    });
    toast.present();
  }

  async rejectionModal(index: number){
    const modal = await this.modalController.create({
      component: RejectionReasonModalComponent,
      showBackdrop: true,
      cssClass: ['modal-xxl', 'backdrop'],
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined && data !== null) {
      console.log('la data del modal es: ',data);
    }
  }
  submit(){
    const post = this.fichaDetailForm.value;
    const sendedPost = {
      ...post,
      codigoUC: post.codigoUC !== 'No asignado' ? post.codigoUC : 0,
      estadoUC: this.construccionService.estadosFichas.enCurso
    };
    console.log('la super ficha',sendedPost);
    console.log('Mapas Aprendizaje',this.mapasAprendizaje);
    console.log('Estrategias metodologicas',this.estrategiasMetodologicas);
    console.log('Guias Evaluacion',this.guiasEvaluacion);
    // this.construccionService.saveFichaResumen(sendedPost).subscribe(data =>{
    //   console.log('La respuesta de ficha resume',data);
    //   this.presentToast('Detalle ficha creado exitosamente');
    //   this.back();
    // });
  }
}
