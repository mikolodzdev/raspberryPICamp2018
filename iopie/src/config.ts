export class Config{
  static tinkerforgeHostname: string = process.env.TINKERFORGE_HOSTNAME || 'localhost';
  static tinkerforgePort: number = parseInt(process.env.TINKERFORGE_PORT || '4223');
  static apiKey: string = process.env.API_KEY || "wrong API key";
}