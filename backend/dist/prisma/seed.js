"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create admin user
        const adminPassword = yield bcryptjs_1.default.hash('admin1234', 10);
        const admin = yield prisma.user.upsert({
            where: { email: 'admin@admin.com' },
            update: {},
            create: {
                email: 'admin@admin.com',
                name: 'Admin',
                password: adminPassword,
                role: 'ADMIN',
            },
        });
        // Create regular user
        const userPassword = yield bcryptjs_1.default.hash('user1234', 10);
        const user = yield prisma.user.upsert({
            where: { email: 'user@user.com' },
            update: {},
            create: {
                email: 'user@user.com',
                name: 'User',
                password: userPassword,
                role: 'USER',
            },
        });
        // Create sample events
        const now = new Date();
        for (let i = 1; i <= 3; i++) {
            const eventName = `Sample Event ${i}`;
            const existing = yield prisma.event.findFirst({ where: { name: eventName } });
            if (!existing) {
                yield prisma.event.create({
                    data: {
                        name: eventName,
                        description: `This is sample event number ${i}.`,
                        eventDate: new Date(now.getTime() + i * 86400000),
                        maxCapacity: 100,
                        creatorId: admin.id,
                    },
                });
            }
        }
    });
}
main()
    .catch(e => {
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
