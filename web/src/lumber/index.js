import Ajv from "ajv";

class Device {
  constructor(raw) {
    this.validator = new Ajv();
    this.parseRaw(raw);
    this.currentDate = new Date();
  }
  parseRaw(raw) {
    this.raw = raw
    const latest = raw.config.slice()
    latest.sort((a, b) => b.id - a.id)
    this.config = latest[0] || {}
    this.key = this.deviceId()
  }

  deviceId() {
    return this.raw.id
  }

  deviceUUID() {
    return this.raw.device_uuid
  }

  lastActive() {
    return new Date(this.raw.last_active)
  }

  isActive() {
    const td = (this.currentDate.getTime() - this.lastActive().getTime()) / 1000
    return td < 10
  }

  prepareSchema(rawSchema) {
    return {
      title: 'Lumber Device Config',
      description: "A configuration of the lumber device",
      type: 'object',
      properties: Object.keys(rawSchema).reduce(
        (sum, field) => {
          return {
            ...sum,
            [field]: {
              description: `Device config field ${field}`,
              type: rawSchema[field],
            }
          }
        },
        {}
      ),
      required: Object.keys(rawSchema)
    };
  }
  hasValidConfig() {
    try {
      return this.validator.compile(this.prepareSchema(this.config.config_schema))(this.config)
    } catch (e) {
      return false;
    }
  }
}

export {Device};