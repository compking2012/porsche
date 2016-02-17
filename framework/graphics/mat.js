"use strict";
var Class = require("../class");
var YObject = require("../yobject");

Class.define("framework.ui.Mat", YObject, {
    create: function(){
        return new Float32Array(16);
    },

    identity: function(dest){
        dest[0]  = 1; dest[1]  = 0; dest[2]  = 0; dest[3]  = 0;
        dest[4]  = 0; dest[5]  = 1; dest[6]  = 0; dest[7]  = 0;
        dest[8]  = 0; dest[9]  = 0; dest[10] = 1; dest[11] = 0;
        dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1;
        return dest;
    },

    multiply: function(mat1, mat2, dest){
        var a = mat1[0],  b = mat1[1],  c = mat1[2],  d = mat1[3],
            e = mat1[4],  f = mat1[5],  g = mat1[6],  h = mat1[7],
            i = mat1[8],  j = mat1[9],  k = mat1[10], l = mat1[11],
            m = mat1[12], n = mat1[13], o = mat1[14], p = mat1[15],
            A = mat2[0],  B = mat2[1],  C = mat2[2],  D = mat2[3],
            E = mat2[4],  F = mat2[5],  G = mat2[6],  H = mat2[7],
            I = mat2[8],  J = mat2[9],  K = mat2[10], L = mat2[11],
            M = mat2[12], N = mat2[13], O = mat2[14], P = mat2[15];
        dest[0] = A * a + B * e + C * i + D * m;
        dest[1] = A * b + B * f + C * j + D * n;
        dest[2] = A * c + B * g + C * k + D * o;
        dest[3] = A * d + B * h + C * l + D * p;
        dest[4] = E * a + F * e + G * i + H * m;
        dest[5] = E * b + F * f + G * j + H * n;
        dest[6] = E * c + F * g + G * k + H * o;
        dest[7] = E * d + F * h + G * l + H * p;
        dest[8] = I * a + J * e + K * i + L * m;
        dest[9] = I * b + J * f + K * j + L * n;
        dest[10] = I * c + J * g + K * k + L * o;
        dest[11] = I * d + J * h + K * l + L * p;
        dest[12] = M * a + N * e + O * i + P * m;
        dest[13] = M * b + N * f + O * j + P * n;
        dest[14] = M * c + N * g + O * k + P * o;
        dest[15] = M * d + N * h + O * l + P * p;
        return dest;
    },

    scale: function(mat, vec, dest){
        dest[0]  = mat[0]  * vec[0];
        dest[1]  = mat[1]  * vec[0];
        dest[2]  = mat[2]  * vec[0];
        dest[3]  = mat[3]  * vec[0];
        dest[4]  = mat[4]  * vec[1];
        dest[5]  = mat[5]  * vec[1];
        dest[6]  = mat[6]  * vec[1];
        dest[7]  = mat[7]  * vec[1];
        dest[8]  = mat[8]  * vec[2];
        dest[9]  = mat[9]  * vec[2];
        dest[10] = mat[10] * vec[2];
        dest[11] = mat[11] * vec[2];
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
        return dest;
    },

    translate: function(mat, vec, dest){
        dest[0] = mat[0]; dest[1] = mat[1]; dest[2]  = mat[2];  dest[3]  = mat[3];
        dest[4] = mat[4]; dest[5] = mat[5]; dest[6]  = mat[6];  dest[7]  = mat[7];
        dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11];
        dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8]  * vec[2] + mat[12];
        dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9]  * vec[2] + mat[13];
        dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
        dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
        return dest;
    },

    rotate: function(mat, rad, axis, dest){
        var dm = dest;
        var sm = mat;
        var x = axis[0];
        var y = axis[1];
        var z = axis[2];
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < 0.000001) {
            return null;
        }
        
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c;

        var a00 = sm[0];
        var a01 = sm[1];
        var a02 = sm[2];
        var a03 = sm[3];
        var a10 = sm[4];
        var a11 = sm[5];
        var a12 = sm[6];
        var a13 = sm[7];
        var a20 = sm[8];
        var a21 = sm[9];
        var a22 = sm[10];
        var a23 = sm[11];

        // Construct the elements of the rotation matrix
        var b00 = x * x * t + c;
        var b01 = y * x * t + z * s;
        var b02 = z * x * t - y * s;
        var b10 = x * y * t - z * s;
        var b11 = y * y * t + c;
        var b12 = z * y * t + x * s;
        var b20 = x * z * t + y * s;
        var b21 = y * z * t - x * s;
        var b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        dm[0] = a00 * b00 + a10 * b01 + a20 * b02;
        dm[1] = a01 * b00 + a11 * b01 + a21 * b02;
        dm[2] = a02 * b00 + a12 * b01 + a22 * b02;
        dm[3] = a03 * b00 + a13 * b01 + a23 * b02;
        dm[4] = a00 * b10 + a10 * b11 + a20 * b12;
        dm[5] = a01 * b10 + a11 * b11 + a21 * b12;
        dm[6] = a02 * b10 + a12 * b11 + a22 * b12;
        dm[7] = a03 * b10 + a13 * b11 + a23 * b12;
        dm[8] = a00 * b20 + a10 * b21 + a20 * b22;
        dm[9] = a01 * b20 + a11 * b21 + a21 * b22;
        dm[10] = a02 * b20 + a12 * b21 + a22 * b22;
        dm[11] = a03 * b20 + a13 * b21 + a23 * b22;

        if (sm !== dm) { // If the source and destination differ, copy the unchanged last row
            dm[12] = sm[12];
            dm[13] = sm[13];
            dm[14] = sm[14];
            dm[15] = sm[15];
        }
        return dm;
    },

    lookAt: function(eye, center, up, dest){
        var eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
            upX     = up[0],     upY     = up[1],     upZ     = up[2],
            centerX = center[0], centerY = center[1], centerZ = center[2];
        if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.identity(dest);}
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
        z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
        l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= l; z1 *= l; z2 *= l;
        x0 = upY * z2 - upZ * z1;
        x1 = upZ * z0 - upX * z2;
        x2 = upX * z1 - upY * z0;
        l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if(!l){
            x0 = 0; x1 = 0; x2 = 0;
        } else {
            l = 1 / l;
            x0 *= l; x1 *= l; x2 *= l;
        }
        y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
        l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if(!l){
            y0 = 0; y1 = 0; y2 = 0;
        } else {
            l = 1 / l;
            y0 *= l; y1 *= l; y2 *= l;
        }
        dest[0] = x0; dest[1] = y0; dest[2]  = z0; dest[3]  = 0;
        dest[4] = x1; dest[5] = y1; dest[6]  = z1; dest[7]  = 0;
        dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0;
        dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
        dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
        dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
        dest[15] = 1;
        return dest;
    },

    perspective: function(fovy, aspect, near, far, dest){
        var t = near * Math.tan(fovy * Math.PI / 360);
        var r = t * aspect;
        var a = r * 2, b = t * 2, c = far - near;
        dest[0] = near * 2 / a;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = near * 2 / b;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = -(far + near) / c;
        dest[11] = -1;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = -(far * near * 2) / c;
        dest[15] = 0;
        return dest;
    },

    transpose: function(mat, dest){
        dest[0]  = mat[0];  dest[1]  = mat[4];
        dest[2]  = mat[8];  dest[3]  = mat[12];
        dest[4]  = mat[1];  dest[5]  = mat[5];
        dest[6]  = mat[9];  dest[7]  = mat[13];
        dest[8]  = mat[2];  dest[9]  = mat[6];
        dest[10] = mat[10]; dest[11] = mat[14];
        dest[12] = mat[3];  dest[13] = mat[7];
        dest[14] = mat[11]; dest[15] = mat[15];
        return dest;
    },

    inverse: function(mat, dest){
        var a = mat[0],  b = mat[1],  c = mat[2],  d = mat[3],
            e = mat[4],  f = mat[5],  g = mat[6],  h = mat[7],
            i = mat[8],  j = mat[9],  k = mat[10], l = mat[11],
            m = mat[12], n = mat[13], o = mat[14], p = mat[15],
            q = a * f - b * e, r = a * g - c * e,
            s = a * h - d * e, t = b * g - c * f,
            u = b * h - d * f, v = c * h - d * g,
            w = i * n - j * m, x = i * o - k * m,
            y = i * p - l * m, z = j * o - k * n,
            A = j * p - l * n, B = k * p - l * o,
            ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
        dest[0]  = ( f * B - g * A + h * z) * ivd;
        dest[1]  = (-b * B + c * A - d * z) * ivd;
        dest[2]  = ( n * v - o * u + p * t) * ivd;
        dest[3]  = (-j * v + k * u - l * t) * ivd;
        dest[4]  = (-e * B + g * y - h * x) * ivd;
        dest[5]  = ( a * B - c * y + d * x) * ivd;
        dest[6]  = (-m * v + o * s - p * r) * ivd;
        dest[7]  = ( i * v - k * s + l * r) * ivd;
        dest[8]  = ( e * A - f * y + h * w) * ivd;
        dest[9]  = (-a * A + b * y - d * w) * ivd;
        dest[10] = ( m * u - n * s + p * q) * ivd;
        dest[11] = (-i * u + j * s - l * q) * ivd;
        dest[12] = (-e * z + f * x - g * w) * ivd;
        dest[13] = ( a * z - b * x + c * w) * ivd;
        dest[14] = (-m * t + n * r - o * q) * ivd;
        dest[15] = ( i * t - j * r + k * q) * ivd;
        return dest;
    }
}, module);
