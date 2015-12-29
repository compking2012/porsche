/**
* Porsche.js is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Yang Yang (compking@gmail.com)
* @license MIT
* @copyright Yang Yang, 2015
*/

"use strict";
var Class = require("../class");
var Camera = require("./camera");
var Vector2 = require("./vector2");
var Vector3 = require("./vector3");
var Matrix4 = require("./matrix4");

Class.define("framework.graphics.PerspectiveCamera", Camera, {
    //fov in RADIANS!
    initialize: function(fieldOfView, viewportWidth, viewportHeight) {
        Camera.call(this);
        var tmpVec3 = new Vector3();

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        this.fieldOfView = fieldOfView;
        this.update();
    },

    update: function() {
        var aspect = this.viewportWidth / this.viewportHeight;

        //create a perspective matrix for our camera
        this.projection.perspective(this.fieldOfView, aspect,
            Math.abs(this.near), Math.abs(this.far));

        //build the view matrix 
        tmpVec3.copy(this.position).add(this.direction);
        this.view.lookAt(this.position, tmpVec3, this.up);

        //projection * view matrix
        this.combined.copy(this.projection).mul(this.view);

        //invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();
    }
}, module);
