class Juego {
    constructor() {
        this.app = new PIXI.Application();
        this.ancho =  1920;
        this.alto = 1080;
        this.fondo = null;
        this.personajes = [];
        this.objetosDeEscenario = [];
        const promesa = this.app.init({ width: this.ancho, height: this.alto, background: "#ffffff" });
        promesa.then(() => this.juegoListo());
    }

    juegoListo() {
        console.log("juego listo");

        document.addEventListener('contextmenu', function(event) {// es para que no aparesca en pantalla el menu con el click derecho
        event.preventDefault(); });

        document.body.appendChild(this.app.canvas);

        window.__PIXI_APP__ = this.app;

        this.iniciarEscena();

        
        this.app.ticker.add(() => this.gameLoop());
    }

    async iniciarEscena() {
        this.cargarEscena();
        await this.ponerFondo();
        this.cargarPeon(9);
        this.cargarArbol(50);
        this.cargarPuntero();
        this.cargarCaballeroRojo(3);
        this.app.stage.sortableChildren = true;
        this.escena.sortableChildren = true;
    }

    cargarPuntero(){
        this.puntero = new Puntero(this.app, this); 
    }

    cargarEscena() {
        this.escena = new PIXI.Container(); 
        this.escena.name = "juego";
        this.escena.sortableChildren = true;
        this.app.stage.addChild(this.escena);
    }

    /*async cargarJugador(cantidad) {
        const promesas = [];
        for (let i = 0; i < cantidad; i++) {
            const ashe = new Personaje("ashe",Math.random() * (this.ancho - 100), Math.random() * (this.alto - 100), this.app,this,15,5,"humana");
            promesas.push(ashe.cargarSpritesAnimados().then(() => {
                this.escena.addChild(ashe.container);
                this.personajes.push(ashe);
            }));
        }
        await Promise.all(promesas);
    }*/

    async cargarPeon(cantidad){
        const promesas =[];
        for ( let i = 0 ; i<cantidad;i++){
            const peon = new Trabajador("trabajador",Math.random()*(this.ancho - 100),Math.random() * (this.alto -100),this.app,this,20,10,"orco");
            promesas.push(peon.cargarSpritesAnimados().then(()=> {
                this.escena.addChild(peon.container);
                this.personajes.push(peon)
            }));
        }
        await Promise.all(promesas);
    }

    async cargarCaballeroRojo(cantidad){
        const promesas = [];
        for( let i = 0; i< cantidad;i++){
            const caballero =  new CaballeroRojo("caballero rojo",Math.random()*(this.ancho - 100),Math.random() * (this.alto -100),this.app,this,20,10,"humana")
            promesas.push(caballero.cargarSpritesAnimados().then(()=>{
                this.escena.addChild(caballero.container);
                this.personajes.push(caballero)
            }));
        }
        await Promise.all(promesas);
    }

    async cargarArbol(cantidad) {
        const promesas = [];
        for (let i = 0; i < cantidad; i++) {
            const arbol = new ObjetosDeEscenario("arbol",Math.random() * (this.ancho - 100), Math.random() * (this.alto - 100), this.app ,this);
            promesas.push(arbol.cargarSpritesAnimados().then(() => {
                this.escena.addChild(arbol.container);
                this.objetosDeEscenario.push(arbol);
            }));
        }
        await Promise.all(promesas);
    }

    async ponerFondo() {
        let textura = await PIXI.Assets.load("bg.png");
        this.fondo = new PIXI.TilingSprite(textura, this.ancho * 3, this.alto * 3);
        this.escena.addChild(this.fondo);
        
    }

    gameLoop() {
        this.personajes.forEach(p => {p.updateZIndex()})
        this.objetosDeEscenario.forEach(o =>{o.updateZIndex()})
        
        this.personajes.forEach(p => {p.update() })
        
    }
};
