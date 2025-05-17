class Trabajador extends Personaje {
    constructor(nombre,x, y, app,juego,puntosDeAtaque,puntosDeDefensa,faccion){
        super(nombre,x, y, app,juego,puntosDeAtaque,puntosDeDefensa,faccion);
    }

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('peoncaminando/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.play();
        this.listo = true;
        this.container.addChild(this.sprite)
    }
    
};