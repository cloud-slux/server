const fs = require('fs');
const path = require('path');

export default class ServiceLoader {
  constructor() {
    this.modules = ['financial', 'management', 'relationship'];
    this.instances = new Map();
  }

  init() {
    this.modules.forEach(module => {
      this.initControllers(module);
    });
  }

  initControllers(module) {
    const dirName =  __dirname + '/' + module;

    let classes = [];

    fs.readdirSync(dirName)
      .filter(file => file !== 'index.js')
      .forEach(file => {
        const filePath = path.join(dirName, file);
        const fileClass = require(filePath).default;
        if(fileClass){
          const fileObject2 = Reflect.construct(fileClass, {});
          classes.push(fileObject2);
        }
      });

    this.instances.set(module, classes);
  }

  getControllers(module) {
    if (this.instances.has(module)) {
      return this.instances.get(module);
    }
  }
}
