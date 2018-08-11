"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
class ConverterCommon extends events_1.EventEmitter {
    constructor(logger, platformData, projectData) {
        super();
        this.logger = logger;
        this.platformData = platformData;
        this.projectData = projectData;
        this.appResourcesDirectoryPath = path.join(projectData.appResourcesDirectoryPath, platformData.normalizedPlatformName);
        this.appResourcesDestinationDirectoryPath = platformData
            .platformProjectService
            .getAppResourcesDestinationDirectoryPath(projectData);
        this.i18nDirectoryPath = path.join(projectData.projectDir, "app", "i18n");
    }
    loadLangage(filePath) {
        delete require.cache[require.resolve(filePath)];
        const fileContent = require(filePath);
        const i18nEntries = new Map();
        const stack = [{ prefix: "", element: fileContent }];
        while (stack.length > 0) {
            const { prefix, element } = stack.pop();
            if (Array.isArray(element)) {
                i18nEntries.set(prefix, element.join(""));
            }
            else if (typeof element === "object") {
                for (const key of Object.keys(element)) {
                    stack.push({ prefix: prefix === "" ? key : `${prefix}.${key}`, element: element[key] });
                }
            }
            else {
                i18nEntries.set(prefix, new String(element).valueOf());
            }
        }
        return i18nEntries;
    }
    run() {
        if (!fs.existsSync(this.i18nDirectoryPath)) {
            this.logger.warn(`'${this.i18nDirectoryPath}' doesn't exists: nothing to localize`);
            return this;
        }
        let defaultLanguage = undefined;
        const languages = new Map();
        fs.readdirSync(this.i18nDirectoryPath).map(fileName => {
            return path.join(this.i18nDirectoryPath, fileName);
        }).filter(filePath => {
            return fs.statSync(filePath).isFile();
        }).forEach(filePath => {
            let language = path.basename(filePath, path.extname(filePath));
            if (path.extname(language) === ".default") {
                language = path.basename(language, ".default");
                defaultLanguage = language;
            }
            languages.set(language, this.loadLangage(filePath));
        });
        if (languages.size === 0) {
            this.logger.warn(`'${this.i18nDirectoryPath}' is empty: nothing to localize`);
            return this;
        }
        if (!defaultLanguage) {
            defaultLanguage = languages.keys().next().value;
            this.logger.warn(`No file found with the .default extension: default langage set to '${defaultLanguage}'`);
        }
        const defaultLanguageI18nEntries = languages.get(defaultLanguage);
        languages.forEach((languageI18nEntries, language) => {
            if (language !== defaultLanguage) {
                languageI18nEntries.forEach((_, key) => {
                    if (!defaultLanguageI18nEntries.has(key)) {
                        defaultLanguageI18nEntries.set(key, key);
                    }
                });
            }
        });
        languages.forEach((languageI18nEntries, language) => {
            if (language !== defaultLanguage) {
                defaultLanguageI18nEntries.forEach((value, key) => {
                    if (!languageI18nEntries.has(key)) {
                        languageI18nEntries.set(key, value);
                    }
                });
            }
        });
        languages.forEach((languageI18nEntries, language) => {
            this.createLanguageResourcesFiles(language, language === defaultLanguage, languageI18nEntries);
        });
        [this.appResourcesDirectoryPath, this.appResourcesDestinationDirectoryPath].forEach(resourcesDirectoryPath => {
            if (fs.existsSync(resourcesDirectoryPath) && fs.statSync(resourcesDirectoryPath).isDirectory()) {
                this.cleanObsoleteResourcesFiles(resourcesDirectoryPath, languages);
            }
        });
        return this;
    }
    createDirectoryIfNeeded(directoryPath) {
        if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
            mkdirp.sync(directoryPath);
        }
        return this;
    }
    removeDirectoryIfEmpty(directoryPath) {
        try {
            fs.rmdirSync(directoryPath);
        }
        catch (error) {
            return false;
        }
        return true;
    }
    removeFileIfExists(filePath) {
        try {
            fs.unlinkSync(filePath);
        }
        catch (error) {
            return false;
        }
        return true;
    }
    writeFileSyncIfNeeded(filePath, content) {
        try {
            if (content === fs.readFileSync(filePath, "utf8")) {
                return false;
            }
        }
        catch (error) { }
        fs.writeFileSync(filePath, content, { encoding: "utf8" });
        return true;
    }
}
ConverterCommon.CONFIGURATION_CHANGED_EVENT = "configurationChangedEvent";
ConverterCommon.RESOURCE_CHANGED_EVENT = "resourceChangedEvent";
exports.ConverterCommon = ConverterCommon;
