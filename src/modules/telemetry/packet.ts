export type primitive = string | number | boolean | null | symbol;

/**
 * A generic telemetry packet that will get used to send telemetry data to the server.
 */
export class TelemetryPacket {
  public data: primitive[];
  /**
   * Creates a new telemetry packet.
   * @param type The type of telemetry data being sent.
   * @param data The data being sent.
   */
  constructor(public label: string, ...data: primitive[]) {
    this.data = data;
  }
}
