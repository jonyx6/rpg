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

        this.app.stage.sortableChildren = true;
        this.app.ticker.add(() => this.gameLoop());
    }

    async iniciarEscena() {
        this.cargarEscena();
        await this.ponerFondo();
        this.cargarJugador(4);
        this.cargarArbol(78);
        this.cargarPuntero();
    }

    cargarPuntero(){
        this.puntero = new Puntero(this.app, this); 
    }

    cargarEscena() {
        this.escena = new PIXI.Container(); 
        this.escena.name = "juego";
        this.app.stage.addChild(this.escena);
    }

    async cargarJugador(cantidad) {
        const promesas = [];
        for (let i = 0; i < cantidad; i++) {
            const ashe = new Personaje(Math.random() * (this.ancho - 100), Math.random() * (this.alto - 100), this.app,this);
            promesas.push(ashe.cargarSpritesAnimados().then(() => {
                this.escena.addChild(ashe.container);
                this.personajes.push(ashe);
            }));
        }
        await Promise.all(promesas);
    }

    async cargarArbol(cantidad) {
        const promesas = [];
        for (let i = 0; i < cantidad; i++) {
            const arbol = new objetosDeEscenario("arbol",Math.random() * (this.ancho - 100), Math.random() * (this.alto - 100), this.app ,this);
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
       
        this.personajes.forEach(p => {p.update() })
        
    }
};
