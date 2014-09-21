/* global angular */
/* jshint bitwise: false */
(function() {
  'use strict';

  angular.module('tenthousandthings').factory('tttColor', [
    function() {
      var colors = {};
      var salts = {
        'default': ''
      };

      /* http://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript */
      function hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
          hash |= 1;
        }

        return hash;
      }

      function intToRGB(i) {
        var color = '';
        [0, 8, 16].forEach(function(shift) {
          var hex = ((i >> shift) & 0xFF).toString(16);
          if (hex.length === 1) {
            hex = 0 + hex;
          }
          color += hex;
        });

        return color;
      }

      function stringToColor(str, k) {
        var key = 'default';
        if (k) {
          key = '_' + k;
        }

        str += salts[key];

        if (!colors[str]) {
          colors[str] = intToRGB(hashCode(str));
        }

        return colors[str];
      }

      /* http://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area */
      function getContrastColor(color, dark, light) {
        var r = parseInt(color.substring(0, 2), 16);
        var g = parseInt(color.substring(2, 4), 16);
        var b = parseInt(color.substring(4, 6), 16);
        var o = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);

        if (o > 125) {
          return dark || '000000';
        } else {
          return light || 'ffffff';
        }
      }

      function setSalt(salt, k) {
        var key = 'default';
        if (k) {
          key = '_' + k;
        }
        salts[key] = '' + salt;
      }

      return {
        stringToColor: stringToColor,
        getContrastColor: getContrastColor,
        setSalt: setSalt
      };
    }
  ]);
})();
