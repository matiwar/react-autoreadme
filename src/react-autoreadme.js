const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const outdent = require('outdent');
const _ = require('lodash');

const defaultConfig = require('../config');

class ReactAutoreadme {
  constructor(config = defaultConfig) {
    this.indentationLength = 0;
    this.config = config;
  }

  /**
   * Return prop indentation
   */
  indent() {
    let indentation = '';
    for (let i = 0; i < this.indentationLength; i++) {
      indentation += ' ';
    }
    return indentation;
  }

  /**
   * Transforms prop type name to known react propTypes
   * @param name String
   */
  getPropTypeName(name) {
    switch (name) {
      case 'union':
        return 'oneOfType';
      case 'enum':
        return 'oneOf';
      default:
        return name;
    }
  }

  /**
   * Returns single prop type for table mode
   * @param prop Object
   */
  getTablePropType(prop) {
    if (!prop) return '';
    return this.getPropTypeName(prop.name);
  }
  
  /**
   * Returns complex prop type for list mode
   * @param prop Object
   */
  getPropType(prop) {
    if (!prop) return '';
    
    let propType = '';
    const propName = this.getPropTypeName(prop.name);

    switch (propName) {
      case 'arrayOf': {
        propType += propName;
        propType += '(\n';
        this.indentationLength += 2;
  
        propType += this.indent();
        propType += this.getPropType(prop.value);
  
        this.indentationLength -= 2;
        propType += '\n';
        propType += this.indent();
        propType += ')';
        break;
      }
      case 'shape': {
        propType += propName;
        propType += '(\n';
        this.indentationLength += 2;
        const objectKeys = Object.keys(prop.value);
  
        objectKeys.forEach((key, index) => {
          propType += this.indent();
          propType += `${key}: `;
          const subProp = prop.value[key];
          propType += this.getPropType(subProp);
  
          if (index < (objectKeys.length - 1)) {
            propType += ',\n';
          }
        });
  
        this.indentationLength -= 2;
        propType += '\n';
        propType += this.indent();
        propType += ')';
        break;
      }
      case 'oneOfType': {
        propType += propName;
        propType += '(';
  
        prop.value.forEach((option, index) => {
          propType += this.getPropType(option);
  
          if (index < (prop.value.length - 1)) {
            propType += ',';
          }
        });
  
        propType += ')';
        break;
      }
      case 'oneOf': {
        propType += propName;
        propType += '[';
        prop.value.forEach((option, index) => {
          propType += option.value;
  
          if (index < (prop.value.length - 1)) {
            propType += ', ';
          }
        });
        propType += ']';
        break;
      }
      case 'instanceOf': {
        propType += `${propName}(${prop.value})`;
        break;
      }
      case 'objectOf': {
        propType += `${propName}(${this.getPropType(prop.value)})`;
        break;
      }
      default:
        propType += propName;
    }
  
    if (prop.required) {
      propType += ' (REQUIRED)';
    }

    if (prop.description) {
      propType += ` // ${prop.description}`;
    }
  
    return propType;
  }
  
  /**
   * Returns components json from react-docgen
   * @param prop Object
   * @see https://github.com/reactjs/react-docgen
   */
  getComponentsJson(dir) {
    const result = shell.exec(`react-docgen ${dir}${this.config.componentsMatch}`, { silent: true }).stdout;
    
    try {
      return JSON.parse(result);
    } catch(e) {
      console.error('Error parsing components. Check your componentsDirectories and filesMatch configuration.');
      return null;
    }
  }

  /**
   * Create readme templates
   */
  createTemplates() {
    this.config.componentsDirectories.forEach(dir => {
      const json = this.getComponentsJson(dir);
    
      json && this.createTemplate(json);
    });
  }

  /**
   * Create readme template from react-docgen json
   * @param json Object
   */
  createTemplate(json) {
    Object.keys(json).forEach((key) => {
      const path = key.split('/').slice(0, -1).join('/');
      const component = json[key];
      const name = component.displayName;
      const description = component.description;
      const props = component.props;
      let propsTemplate = '';
  
      if (props) {
        if (this.config.mode === 'table') {
          propsTemplate += 'Prop|Description|Type|Default|Required\n'
          propsTemplate += '---|---|---|---|---\n'
        }
  
        Object.keys(props).map((propKey, index) => {
          const prop = props[propKey];
          this.indentationLength = 0;
  
          const propName = propKey;
          const propDescription = prop.description;
          const defaultValue = prop.defaultValue ? `\`${prop.defaultValue.value}\`` : '';
  
          let required ;
  
          if(this.config.mode === 'table') {
            required = prop.required ? '✅' : '';
            propsTemplate += `|**${propKey}**|${prop.description}|\`${this.getTablePropType(prop.type)}\`|${defaultValue}|${required}\n`;
          } else {
            required = prop.required ? ' (required)' : '';
            propsTemplate += `#### ${propName}${required}\n`;
            propsTemplate += propDescription ? `${propDescription}\n\n` : '';
            propsTemplate += 'Type:\n';
            propsTemplate += '```js';
            propsTemplate += `\n${this.getPropType(prop.type)}\n`;
            propsTemplate += '```\n';
            propsTemplate += defaultValue ? `Default value: ${defaultValue}\n` : '';
  
            if (index < props.length - 1) {
              propsTemplate += '\n --- \n';
            }
          }
        });
      }
  
      this.writeTemplate(path, name, description, propsTemplate)
    });
  }

  /**
   * Write component readme
   * @param path String
   * @param name String
   * @param description String
   * @param propsTemplate String
   */
  writeTemplate(path, name, description, propsTemplate) {
    const content = outdent`
      # ${name}
      ${description}
      
      ### Props:
      ${propsTemplate}
    `;
  
      fs.writeFile(`${path}/readme.md`, content, (err) => {
        if (err) {
          return console.log(err);
        }
  
        if (!this.config.silent) {
          console.log(`Readme for component ${name} created.`);
        }
      });
  }
}

let config = defaultConfig;

try {
  const externalConfig = require(path.resolve('react-autoreadme.config.js'));
  _.extend(config, externalConfig);
} catch(ex) {
  console.log("No configuration file found, using defaults.")
}

if (config.generate) {
  const reactAutoreadme = new ReactAutoreadme(config);
  reactAutoreadme.createTemplates();
}

module.exports = ReactAutoreadme;