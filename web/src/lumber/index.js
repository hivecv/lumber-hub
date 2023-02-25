import Ajv from "ajv";

class Device {
  constructor(raw) {
    this.validator = new Ajv();
    this.parseRaw(raw)
  }
  parseRaw(raw) {
    this.rawConfig = raw
    this.schema = JSON.parse(this.rawConfig.config_schema || "{}")
    this.config = JSON.parse(this.rawConfig.config || "{}")
    this.key = this.deviceId()
  }

  deviceId() {
    return this.rawConfig.id
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
    return this.validator.compile(this.prepareSchema(this.schema))(this.config)
  }

  getJsonData() {
    return {
      ...this.rawConfig,
      config_schema: JSON.stringify(this.schema),
      config: JSON.stringify(this.config),
    }
  }
}

export {Device};