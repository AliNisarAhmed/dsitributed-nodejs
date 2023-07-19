import { EventEmitter } from "events";
import pg from 'pg'

const { Client } = pg;

export class DatabaseReconnection extends EventEmitter {
  #client = null;
  #conn = null;
  #kill = false;
  connected = false;

  constructor(conn) {
    super();
    this.#conn = conn;
  }

  connect() {
    if (this.#client) {
      // terminate any existing connections
      this.#client.end();
    }

    if (this.#kill) {
      // #kill is used to prevent the class from
      // reconnecting after being manually disconnected
      return;
    }

    const client = new Client(this.#conn);

    client.on("error", (err) => this.emit("error", err));

    client.once("end", () => {
      if (this.connected) {
        this.emit("disconnect");
      }
      this.connected = false;
      if (this.kill) {
        return;
      }

      setTimeout(() => this.connect(), this.#conn.retry || 1_000);
    });

    client.connect((err) => {
      this.connected = !err;
      if (!err) {
        this.emit("connect");
      }
    });

    this.#client = client;
    this.emit("reconnect");
  }

  async query(query, params) {
    if (this.#kill || !this.connected) {
      throw new Error("disconnected");
    }

    return this.#client.query(query, params);
  }

  disconnect() {
    this.#kill = true;
    this.#client.end();
  }
}
