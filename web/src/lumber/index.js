import Ajv from "ajv";

class Device {
  constructor(raw) {
    this.validator = new Ajv();
    this.parseRaw(raw)
  }
  parseRaw(raw) {
    this.rawConfig = raw
    this.schema = this.prepareSchema(JSON.parse(this.rawConfig.config_schema || "{}"))
    this.config = JSON.parse(this.rawConfig.config || "{}")
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
    console.log("TEST", this.schema, this.config)
    return this.validator.compile(this.schema)(this.config)
  }
}

export {Device};