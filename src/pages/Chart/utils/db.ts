import Dexie, { Table } from "dexie";
import { PositionModel } from "./types";
export class ChartDB extends Dexie {
  positions!: Table<PositionModel, number>;
  constructor() {
    super("ChartDB");
    this.version(1).stores({
      positions: "++id,direction,profit,openPrice,closePrice,symbol,exchange",
    });
  }

  deletePosition(id: number) {
    this.positions.where({ id }).delete();
  }

  createPosition(position: PositionModel) {
    this.positions.add(position);
  }

  clearPositions() {
    this.positions.clear();
  }

  async getPositions() {
    return await this.positions.toArray();
  }
}

export const chartDB = new ChartDB();

// db.on("populate", populate);
