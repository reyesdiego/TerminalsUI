angular.module('ui.bootstrap.datetimepicker').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/datetime-picker.html',
    "<ul class=\"dropdown-menu dropdown-menu-right\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', right: position.right+'px'}\" style=left:inherit ng-keydown=keydown($event)><li style=\"padding:0 5px 5px 5px\" class=datetime-picker><div ng-transclude></div></li><li ng-if=showButtonBar style=padding:5px><span class=\"btn-group pull-left\" style=margin-right:10px><button ng-if=\"showPicker == 'date'\" type=button class=\"btn btn-sm btn-info\" ng-click=\"select('today')\">{{ getText('today') }}</button> <button ng-if=\"showPicker == 'time'\" type=button class=\"btn btn-sm btn-info\" ng-click=\"select('now')\">{{ getText('now') }}</button> <button type=button class=\"btn btn-sm btn-danger\" ng-click=select(null)>{{ getText('clear') }}</button></span> <span class=\"btn-group pull-right\"><button ng-if=\"showPicker == 'date' && enableTime\" type=button class=\"btn btn-sm btn-default\" ng-click=\"changePicker('time')\">{{ getText('time')}}</button> <button ng-if=\"showPicker == 'time' && enableDate\" type=button class=\"btn btn-sm btn-default\" ng-click=\"changePicker('date')\">{{ getText('date')}}</button> <button type=button class=\"btn btn-sm btn-success\" ng-click=close()>{{ getText('close') }}</button></span></li></ul>"
  );

}]);
