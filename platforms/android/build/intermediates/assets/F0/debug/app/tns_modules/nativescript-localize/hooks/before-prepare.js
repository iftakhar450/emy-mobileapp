"use strict";
const converter_common_1 = require("./converter.common");
const converter_android_1 = require("./converter.android");
const converter_ios_1 = require("./converter.ios");
module.exports = function (androidResourcesMigrationService, logger, platformsData, projectData, hookArgs) {
    const platformName = hookArgs.platform.toLowerCase();
    const platformData = platformsData.getPlatformData(platformName, projectData);
    let converter;
    if (platformName === "android") {
        converter = new converter_android_1.ConverterAndroid(androidResourcesMigrationService, logger, platformData, projectData);
    }
    else if (platformName === "ios") {
        converter = new converter_ios_1.ConverterIOS(logger, platformData, projectData);
    }
    else {
        logger.warn(`Platform '${platformName}' isn't supported: skipping localization`);
        return;
    }
    converter
        .on(converter_common_1.ConverterCommon.RESOURCE_CHANGED_EVENT, () => hookArgs.changesInfo.appResourcesChanged = true)
        .on(converter_common_1.ConverterCommon.CONFIGURATION_CHANGED_EVENT, () => hookArgs.changesInfo.configChanged = true)
        .run();
};
