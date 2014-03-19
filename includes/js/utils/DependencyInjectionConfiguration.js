/// <reference path="~/globalDefinitions.js"/>

Deft.Injector.configure({
    geolocation: {
        fn: function() {
            if ( Ext.os.is.Desktop ) {
                return Ext.create('WebSurvey.mock.hal.Geolocation');
            }
            else {
                return Ext.create('WebSurvey.hal.Geolocation');
            }
        },
        singleton: true
    },
    camera: {
        fn: function() {
            if (Ext.os.is.Desktop) {
                return Ext.create('WebSurvey.mock.hal.Camera');
            }
            else {
                return Ext.create('WebSurvey.hal.Camera');
            }
        },
        singleton: true
    },
    fileSystem: {
        fn: function () {
            if (Ext.os.is.Desktop) {
                return Ext.create('WebSurvey.mock.common.FileSystemHelper');
            }
            else {
                return Ext.create('WebSurvey.common.FileSystemHelper');
            }
        },
        singleton: true
    },
    deviceInfo: {
        fn: function () {
            if (Ext.os.is.Desktop) {
                return Ext.create('WebSurvey.mock.hal.DeviceInfo');
            }
            else {
                return Ext.create('WebSurvey.hal.DeviceInfo');
            }
        },
        singleton: true
    },
    orientation: {
        fn: function () {
            if (Ext.os.is.Desktop) {
                return Ext.create('WebSurvey.mock.hal.Orientation');
            }
            else {
                return Ext.create('WebSurvey.hal.Orientation');
            }
        },
        singleton: true
    }
});