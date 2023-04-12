import Ajv from "ajv";
import Peer from "simple-peer";

class Device {
  webrtc = null;

  constructor(raw) {
    this.validator = new Ajv();
    this.parseRaw(raw);
    this.currentDate = new Date();
  }
  parseRaw(raw) {
    this.rawConfig = raw
    this.schema = JSON.parse(this.rawConfig.config_schema || "{}")
    const raw_config = JSON.parse(this.rawConfig.config || "{}")
    this.updateConfig(raw_config)
    this.key = this.deviceId()
  }

  deviceId() {
    return this.rawConfig.id
  }

  startLiveStream(on_signal, on_video) {
    this.webrtc = new Peer({initiator: true});
    this.webrtc.on('signal', data => {
      on_signal({
        id: this.deviceUUID(),
        data: {
          name: "LIVESTREAM_CLIENT",
          payload: data,
        },
      })
    })
    this.webrtc.on('stream', on_video)
  }

  deviceUUID() {
    return this.rawConfig.device_uuid
  }

  lastActive() {
    return new Date(this.rawConfig.last_active)
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
    return this.validator.compile(this.prepareSchema(this.schema))(this.config)
  }

  updateConfig(raw_config) {
    this.config = {}
    for (const field in raw_config) {
      switch (this.schema[field]) {
        case "number":
          this.config[field] = +raw_config[field]
          break
        default:
          this.config[field] = raw_config[field]
      }
    }
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