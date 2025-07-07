import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser'
import { useParams, useSearchParams } from 'react-router-dom';
import { auth } from '../auth/auth';

const Multispace: React.FC = () => {
  const TILE_SIZE = 16;

  const gameRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const { spaceId } = useParams();
  const [users, setUsers] = useState<{ userId: string }[]>([]);
  console.log(spaceId);
  const mapId = params.get('mapId');
  const width = parseInt(params.get('width') || "500");
  const height = parseInt(params.get('height') || "500");
  const userId = auth.getUserId();
  type RemotePlayers = {
    [id: string]: Phaser.GameObjects.Sprite;
  };
  // initialise WebSocket instance
  const sock: WebSocket = new WebSocket('http://localhost:8080');

  useEffect(() => {
    class myscene extends Phaser.Scene {
      socket!: WebSocket;
      player!: Phaser.Physics.Arcade.Sprite;
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      spaceId!: string;
      others: { [userId: string]: Phaser.GameObjects.Sprite } = {};

      constructor() {
        super("myscene");
      }
      preload() {
        // load the map scene
        this.load.tilemapTiledJSON('map', `/assets/${mapId}.json`);
        this.load.image('tiles', '/assets/tilemap_packed.png');
        this.load.spritesheet('player', '/assets/player.png', {
          frameWidth: 20,
          frameHeight: 20,
        });
        this.load.spritesheet('player2','/assets/player.png',{
          frameWidth:20,
          frameHeight:20
        });

      }
      create() {
        const camera = this.cameras.main
        this.input.keyboard?.on('keydown-PLUS', () => {
          camera.setZoom(camera.zoom + 0.2);
        });
        this.input.keyboard?.on('keydown-MINUS', () => {
          camera.setZoom(camera.zoom - 0.2)
        })
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tilemap_packed', 'tiles');
        map.createLayer('ground', tileset!, 0, 0);
        const walls = map.createLayer('walls', tileset!, 0, 0);
        walls?.setCollisionByProperty({ collides: true });
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, walls!);
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.socket = sock;
        this.socket.onopen = () => {
          this.socket.send(JSON.stringify({
            type: "join",
            payload: {
              spaceId: spaceId,
              token: auth.getToken()
            }
          }))
        }

        this.socket.onmessage = (event) => {
          const message = JSON.parse(event.data)
          switch (message.type) {
            case "space-joined": {
              const { spawn, users } = message.payload;
              this.player.setPosition(spawn.x, spawn.y);
              users.forEach((u: { userId: string,x:number,y:number }) => {
                const other = this.add.sprite(u.x, u.y, 'player2');
                this.others[u.userId] = other;
              });
              break;
            }

            case 'user-joined': {
              const { userId, x, y } = message.payload;
              if (!this.others[userId]) {
                // add newly joined user's sprite
                const other = this.add.sprite(x, y, 'player');
                this.others[userId] = other;
              }
              break;
            }

            case 'movement': {
              const { userId, x, y } = message.payload;
              const other = this.others[userId];
              if (other) {
                other.setPosition(x, y);
              }
              break;
            }

            case 'user-left': {
              const { userId } = message.payload;
              if (this.others[userId]) {
                this.others[userId].destroy();
                delete this.others[userId];
              }
              break;
            }
          }

        }
      }
      update() {
        const speed = 200;
        const player = this.player;
        const cursors = this.cursors;
        let moved = false;
        player.setVelocity(0);

        if (cursors.left?.isDown) {
          player.setVelocityX(-speed);
          moved = true;
        } else if (cursors.right?.isDown) {
          player.setVelocityX(speed);
          moved = true;
        }

        if (cursors.up?.isDown) {
          player.setVelocityY(-speed);
          moved = true;
        } else if (cursors.down?.isDown) {
          player.setVelocityY(speed);
          moved = true;
        }
        if (moved) {
          this.socket.send(JSON.stringify({
            type: 'move',
            payload: {
              x: Math.round(this.player.x),
              y: Math.round(this.player.y)
            }
          }));
      }
    }
  }
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 384,
      height: 384,
      parent: gameRef.current || undefined,
      scene: myscene,
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


  });

  return <div ref={gameRef} />
}

export default Multispace;