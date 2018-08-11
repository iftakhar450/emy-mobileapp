"use strict";
module.exports = function (hookArgs) {
    if (hookArgs.liveSyncData && !hookArgs.liveSyncData.bundle) {
        return (args, originalMethod) => {
            return originalMethod(...args).then(originalPatterns => {
                const projectData = hookArgs.projectData;
                const appResourcesRelativeDirectoryPath = projectData.getAppResourcesRelativeDirectoryPath();
                originalPatterns.push(`!${appResourcesRelativeDirectoryPath}/Android/values/strings.xml`);
                originalPatterns.push(`!${appResourcesRelativeDirectoryPath}/Android/values-*/strings.xml`);
                originalPatterns.push(`!${appResourcesRelativeDirectoryPath}/Android/src/main/res/values/strings.xml`);
                originalPatterns.push(`!${appResourcesRelativeDirectoryPath}/Android/src/main/res/values-*/strings.xml`);
                originalPatterns.push(`!${appResourcesRelativeDirectoryPath}/iOS/*.lproj/InfoPlist.strings`);
                originalPatterns.push(`!${appResourcesRelativeDirectoryPath}/iOS/*.lproj/Localizable.strings`);
                return originalPatterns;
            });
        };
    }
};
