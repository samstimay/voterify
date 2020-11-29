"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Permissions {
    constructor(type) {
        this.type = type;
    }
    isAdmin() {
        return this.type === 'admin';
    }
}
exports.default = Permissions;
//# sourceMappingURL=permissions.js.map