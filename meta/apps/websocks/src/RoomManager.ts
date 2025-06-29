import type { User } from "./User";
import { OutgoingMessage } from "./types";

export class RoomManager {
    rooms: Map<string, User[]> = new Map();
    static instance: RoomManager;

    private constructor() {
        this.rooms = new Map();
    }
    // create an instance if not present
    // singleton class...ie only one instance of that class exists globally.
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    public removeUser(user: User, spaceId: string) {
        if (!this.rooms.has(spaceId)) {
            return;
        }
        // removes user based on id provided during creation of an User object
        // new change, remove user based on userId directly, removing the need for use of another id.
        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u) => u.userId !== user.userId) ?? []));
    }

    public addUser(spaceId: string, user: User) {
        if (!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
            return;
        }
        // add user to a space using the above declared map dataStructure.
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
    }

    // broadcast message to clients connected to current websocket server in current room.
    public broadcast(message: OutgoingMessage, user: User, roomId: string) {
        if (!this.rooms.has(roomId)) {
            return;
        }
        this.rooms.get(roomId)?.forEach((u) => {
            if (u.userId !== user.userId) {
                u.send(message);
            }
        });
    }
}