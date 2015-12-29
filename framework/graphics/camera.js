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
var YObject = require("../yobject");
var Vector3 = require("./vector3");
var Vector4 = require("./vector4");
var Matrix4 = require("./matrix4");
var Quaternion = require("./quaternion");

/**
 * Base class of Camera that can be used to compute 3D transformations
 * and generate a matrix that can be applied.
 * Note that this class is never used to instantiate directly.
 * Instead, instantiate a subclass of this class.
 * @class Camera
 * @extends YObject
 */
Class.define("framework.graphics.Camera", YObject, {
    /**
     * Constructor that create a camera.
     * @method Camera#initialize
     */
    initialize: function() {
        YObject.prototype.initialize.apply(this, arguments);

        this._tmpVec3 = new Vector3();
        this._tmpVec4 = new Vector4();
        this._direction = new Vector3(0, 0, -1);
        this._up = new Vector3(0, 1, 0);
        this._position = new Vector3();

        this._projection = new Matrix4();
        this._view = new Matrix4();
        this._combined = new Matrix4();
        this._invProjectionView = new Matrix4();

        this._near = 1;
        this._far = 100;

        this._ray = {
            origin: new Vector3(),
            direction: new Vector3()
        };

        this._viewportWidth = 0;
        this._viewportHeight = 0;
    },

    /**
     * Destructor that destroy a camera.
     * @method Camera#destroy
     */
    destroy: function() {
        this._tmpVec3.destroy();
        this._tmpVec3 = null;

        this._tmpVec4.destroy();
        this._tmpVec4 = null;

        this._direction.destroy();
        this._direction = null;

        this._up.destroy();
        this._up = null;

        this._position.destroy();
        this._position = null;

        this._projection.destroy();
        this._projection = null;

        this._view.destroy();
        this._view = null;

        this._combined.destroy();
        this._combined = null;

        this._invProjectionView.destroy();
        this._invProjectionView = null;

        this._ray.origin.destroy();
        this._ray.direction.destroy();
        this._ray = null;

        YObject.prototype.destroy.apply(this, arguments);
    },

    static: {
        FAR_RANGE: 1.0,
        NEAR_RANGE: 0.0
    },

    /**
     * Sets the width and height of the viewport. Does not
     * update any matrices.
     * @method Camera#setViewport
     * @param {Number} width - the viewport width.
     * @param {Number} height - the viewport height.
     */
    setViewport: function(width, height) {
        this._viewportWidth = width;
        this._viewportHeight = height;
    },

    /**
     * Translates this camera by a specified Vector3 object.
     * @method Camera#translate
     * @param {Vector3} vec - the 3D vector.
     */
    /**
     * Translates this camera by a specified x, y, z parameters.
     * Any undefined x y z values will default to zero,
     * leaving that component unaffected.
     * @method Camera#translate
     * @param {Number} x - the x component.
     * @param {Number} y - the y component.
     * @param {Number} z - the z component.
     */
    translate: function(x, y, z) {
        if (typeof x === "object") {
            this._position.x += x.x || 0;
            this._position.y += x.y || 0;
            this._position.z += x.z || 0;
        } else {
            this._position.x += x || 0;
            this._position.y += y || 0;
            this._position.z += z || 0;
        }
    },

    /**
     * Move this camera to a specified Vector3 object.
     * @method Camera#translate
     * @param {Vector3} vec - the 3D vector.
     */
    /**
     * Move this camera by a specified x, y, z parameters.
     * Any undefined x y z values will default to zero,
     * leaving that component unaffected.
     * @method Camera#translate
     * @param {Number} x - the x component.
     * @param {Number} y - the y component.
     * @param {Number} z - the z component.
     */
    lookAt: function(x, y, z) {
        var dir = this._direction;
        var up = this._up;

        if (typeof x === "object") {
            dir.copy(x);
        } else {
            dir.set(x, y, z);
        }

        dir.subtract(this._position);
        dir.normalize();

        // Calculate right vector
        this._tmpVec3.copy(dir);
        this._tmpVec3.cross(up);
        this._tmpVec3.normalize();

        // Calculate up vector
        up.copy(this._tmpVec3);
        up.cross(dir);
        up.normalize();
    },

    rotate: function(radians, axis) {
        var tmpMat4 = new Matrix4();
        var tmpQuat = new Quaternion();
        var tmpVec3 = new Vector3();
        tmpVec3.set(0, 0, 0);

        // Set the quaternion to our axis angle
        tmpQuat.setAxisAngle(axis, radians);

        // Create a rotation matrix from the axis angle
        tmpMat4.fromRotationTranslation(tmpQuat, tmpVec3);

        // Multiply our vector by the rotation matrix
        this.direction.transformMat4(tmpMat4);
        this.up.transformMat4(tmpMat4);
    },

    rotateAround: function(point, radians, axis) {
        this._tmpVec3.copy(point);
        this._tmpVec3.sub(this._position);
        this.translate(this._tmpVec3);
        this.rotate(radians, axis);
        this.translate(this._tmpVec3.negate());
    },

    project: function(vec, out) {
        if (!out) {
            out = new Vector4();
        }

        // TODO: support viewport XY
        var viewportWidth = this._viewportWidth;
        var viewportHeight = this._viewportHeight;
        var n = this.constructor.NEAR_RANGE;
        var f = this.constructor.FAR_RANGE;

        // for useful Z and W values we should do the usual steps...
        //    clip space -> NDC -> window coords

        var tmpVec4 = this._tmpVec4;
        // implicit 1.0 for w component
        tmpVec4.set(vec.x, vec.y, vec.z, 1.0);

        // transform into clip space
        tmpVec4.transformMat4(this._combined);

        // now into NDC
        tmpVec4.x = tmpVec4.x / tmpVec4.w;
        tmpVec4.y = tmpVec4.y / tmpVec4.w;
        tmpVec4.z = tmpVec4.z / tmpVec4.w;

        // and finally into window coordinates
        out.x = viewportWidth / 2 * tmpVec4.x + (0 + viewportWidth / 2);
        out.y = viewportHeight / 2 * tmpVec4.y + (0 + viewportHeight / 2);
        out.z = (f - n) / 2 * tmpVec4.z + (f + n) / 2;

        // if the out vector has a fourth component, we also store (1/clip.w)
        // same idea as gl_FragCoord.w
        if (out.w === 0 || out.w) {
            out.w = 1 / tmpVec4.w;
        }

        return out;
    },

    unproject: function(vec, out) {
        if (!out) {
            out = new Vector3();
        }

        var tmpVec4 = this._tmpVec4;
        var viewport = tmpVec4.set(0, 0, this._viewportWidth, this._viewportHeight);
        out.copy(vec);
        out.unproject(viewport, this._invProjectionView);

        return out;
    },

    getPickRay: function(x, y) {
        var tmpVec4 = this._tmpVec4;
        var origin = this._ray.origin;
        origin.set(x, y, 0);
        var direction = this._ray.direction;
        direction.set(x, y, 1);
        var viewport = tmpVec4.set(0, 0, this._viewportWidth, this._viewportHeight);
        var mtx = this._invProjectionView;

        origin.unproject(viewport, mtx);
        direction.unproject(viewport, mtx);

        direction.sub(origin);
        direction.normalize();

        return this._ray;
    },

    update: function() {
        // TO BE IMPLEMENTED
    }
}, module);
