type primitive = string | number | boolean;

type MaybeArray<T> = T | T[];

export class Packet {
  constructor(
    public label: string,
    public data?: MaybeArray<primitive>
  ) {}
}

export class TelemetrySystem {
  private static _instance: TelemetrySystem;
  private constructor() {}

  public static get instance() {
    if (!TelemetrySystem._instance) {
      TelemetrySystem._instance = new TelemetrySystem();
    }

    return TelemetrySystem._instance;
  }

  private packets: Packet[] = [];

  public addPacket(packet: Packet) {
    this.packets.push(packet);
  }

  public addPackets(packets: Packet[]) {
    this.packets.push(...packets);
  }

  public addData(label: string, data?: MaybeArray<primitive>) {
    this.packets.push(new Packet(label, data || ""));
  }

  public clearPackets() {
    this.packets = [];
  }

  public logData() {
    console.clear();
    console.table(
      this.packets.map((packet) => ({ label: packet.label, data: packet.data }))
    );
    this.clearPackets();
  }

  public renderPackets() {
    const verOffset = 10;

    const packetMapped = this.packets.map(
      (p) =>
        `${p.label}${p.data ? ":" : ""} ${
          Array.isArray(p.data) ? p.data.join(", ") : p.data
        }`
    );

    fill(255);
    fill(0);
    textAlign(LEFT, CENTER);
    text(
      packetMapped.join("\n"),
      10,
      windowHeight - packetMapped.length * verOffset
    );
    this.clearPackets();
  }
}
