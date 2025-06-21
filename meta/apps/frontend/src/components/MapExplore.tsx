import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRef } from 'react'
import Phaser from 'phaser'
import { useSearchParams,useParams } from 'react-router-dom'

    const MapExplore: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [params] = useSearchParams();
    const {spaceId} = useParams();
    let width,height;
    const mapId = params.get('mapId');
    width = parseInt(params.get('width') || '500');
     height = parseInt(params.get('height') || '500');
    // console.log(mapId);
    useEffect(() => {
        class Myscene extends Phaser.Scene {
            player!: Phaser.Physics.Arcade.Sprite;
            cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

            constructor() {
                super('MyScene');
            }
            preload() {
                this.load.tilemapTiledJSON('map', `/assets/${mapId}.json`);
                this.load.image('tiles', '/assets/tilemap_packed.png');
                this.load.spritesheet('player', '/assets/player.png', {
                    frameWidth: 20,
                    frameHeight: 20,
                });
            }

            create() {
                const map = this.make.tilemap({ key: 'map' });
                const tileset = map.addTilesetImage('tilemap_packed', 'tiles');
                // setHeight(map.height*map.tileHeight);
                // setWidth(map.width*map.tileWidth);
                const camera = this.cameras.main
                this.input.keyboard?.on('keydown-PLUS', () => {
                    camera.setZoom(camera.zoom + 0.2);
                });
                this.input.keyboard?.on('keydown-MINUS', () => {
                    camera.setZoom(camera.zoom - 0.2)
                })
                this.input.on('wheel', (_: any, __: any, deltaY: number) => {
                    const newZoom = Phaser.Math.Clamp(camera.zoom - deltaY * 0.001, 0.2, 4);
                    camera.setZoom(newZoom);
                });
                let dragStart = { x: 0, y: 0 };
                this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                    dragStart = { x: pointer.x, y: pointer.y };
                });

                const layer2 = map.createLayer('ground', tileset!, 0, 0);
                const layer1 = map.createLayer('walls', tileset!, 0, 0);
                layer1!.setCollisionByProperty({ collides: true });

                this.player = this.physics.add.sprite(100, 100, 'player');
                this.player.setCollideWorldBounds(true);


                this.physics.add.collider(this.player, layer1!);


                this.cursors = this.input.keyboard!.createCursorKeys();
            }
            update() {
                const speed = 200;
                const player = this.player;
                const cursors = this.cursors;

                player.setVelocity(0);

                if (cursors.left?.isDown) {
                    player.setVelocityX(-speed);
                } else if (cursors.right?.isDown) {
                    player.setVelocityX(speed);
                }

                if (cursors.up?.isDown) {
                    player.setVelocityY(-speed);
                } else if (cursors.down?.isDown) {
                    player.setVelocityY(speed);
                }
            }
        }
        const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: width,
                height: height,
                parent: gameRef.current || undefined,
                scene: Myscene,
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: false,
                    },
                },
            };
        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, [])
    return <div ref={gameRef} />;
}

export default MapExplore;