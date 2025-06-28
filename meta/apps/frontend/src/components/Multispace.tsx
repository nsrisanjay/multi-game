import React from 'react'
import { useState,useEffect,useRef } from 'react';
import Phaser from 'phaser'
import { useParams,useSearchParams } from 'react-router-dom';
import { auth } from '../auth/auth';

const Multispace : React.FC = ()=>{
  const TILE_SIZE = 16;
  const gameRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const {spaceId} = useParams();
  console.log(spaceId);
  const mapId = params.get('mapId');
  const width = parseInt(params.get('width') || "500");
  const height = parseInt(params.get('height')||"500");
  const userId = auth.getUserId();
  type RemotePlayers = {
  [id: string]: Phaser.GameObjects.Sprite;
};

  useEffect(()=>{
    class myscene extends Phaser.Scene{
      socket!: WebSocket;
      player!: Phaser.Physics.Arcade.Sprite;
      others: RemotePlayers = {};
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      spaceId!: string;

      constructor(){
        super("myscene");
      }
       preload() {
        this.load.tilemapTiledJSON('map', `/assets/${mapId}.json`);
        this.load.image('tiles', '/assets/tilemap_packed.png');
        this.load.image("player", `/assets/${userId}.png`);
        this.load.image("player-other", "/assets/player.png");
      }
      create()
      {
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = ()=>{
          this.socket.send(JSON.stringify({
            type:"join",
            payload:{
              spaceId:spaceId,
              token : auth.getToken()
            }
          }))
        }
      }


    }
    

  })

  return <div ref = {gameRef}>

  </div>
}

export default Multispace