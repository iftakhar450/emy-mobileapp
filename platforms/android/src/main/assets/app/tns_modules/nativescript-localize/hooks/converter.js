"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const converter_common_1 = require("./converter.common");
const resource_android_1 = require("../src/resource.android");
class ConverterAndroid extends converter_common_1.ConverterCommon {
    constructor(androidResourcesMigrationService, logger, platformData, projectData) {
        super(logger, platformData, projectData);
        this.androidResourcesMigrationService = androidResourcesMigrationService;
        this.logger = logger;
        this.platformData = platformData;
        this.projectData = projectData;
        if (androidResourcesMigrationService.hasMigrated(projectData.appResourcesDirectoryPath)) {
            this.appResourcesDirectoryPath = path.join(this.appResourcesDirectoryPath, "src", "main", "res");
        }
    }
    cleanObsoleteResourcesFiles(resourcesDirectory, languages) {
        fs.readdirSync(resourcesDirectory).filter(fileName => {
            const match = /^values-(.+)$/.exec(fileName);
            return match && !languages.has(match[1].replace(/^(.+?)-r(.+?)$/, "$1-$2"));
        }).map(fileName => {
            return path.join(resourcesDirectory, fileName);
        }).filter(filePath => {
            return fs.statSync(filePath).isDirectory();
        }).forEach(lngResourcesDir => {
            const resourceFilePath = path.join(lngResourcesDir, "strings.xml");
            const resourceChanged = this.removeFileIfExists(resourceFilePath);
            if (this.removeDirectoryIfEmpty(lngResourcesDir) || resourceChanged) {
                this.emit(converter_common_1.ConverterCommon.RESOURCE_CHANGED_EVENT);
            }
        });
        return this;
    }
    createLanguageResourcesFiles(language, isDefaultLanguage, i18nEntries) {
        const languageResourcesDir = path.join(this.appResourcesDirectoryPath, `values${isDefaultLanguage ? "" : `-${language.replace(/^(.+?)-(.+?)$/, "$1-r$2")}`}`);
        this.createDirectoryIfNeeded(languageResourcesDir);
        let strings = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n";
        i18nEntries.forEach((value, key) => {
            const encodedKey = resource_android_1.encodeKey(key);
            const encodedValue = resource_android_1.encodeValue(value);
            strings += `  <string name="${encodedKey}">${encodedValue}</string>\n`;
            if (key === "app.name") {
                strings += `  <string name="app_name">${encodedValue}</string>\n`;
                strings += `  <string name="title_activity_kimera">${encodedValue}</string>\n`;
            }
        });
        strings += "</resources>\n";
        const resourceFilePath = path.join(languageResourcesDir, "strings.xml");
        if (this.writeFileSyncIfNeeded(resourceFilePath, strings)) {
            this.emit(converter_common_1.ConverterCommon.RESOURCE_CHANGED_EVENT);
        }
        return this;
    }
}
exports.ConverterAndroid = ConverterAndroid;
