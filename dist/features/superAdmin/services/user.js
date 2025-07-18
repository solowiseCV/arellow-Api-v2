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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUsersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { userType, kycStatus, search, suspended, page = "1", limit = "10", } = query;
    const where = {};
    if (userType && Object.values(client_1.Role).includes(userType)) {
        where.role = userType;
    }
    if (kycStatus && Object.values(client_1.KycStatus).includes(kycStatus)) {
        where.kyc_status = kycStatus;
    }
    if (typeof suspended !== 'undefined') {
        where.suspended = suspended === 'true';
    }
    if (search) {
        where.OR = [
            { fullname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone_number: { contains: search, mode: 'insensitive' } },
        ];
    }
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);
    const [users, total] = yield Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fullname: true,
                email: true,
                phone_number: true,
                avatar: true,
                role: true,
                last_login: true,
                kyc_status: true,
            },
        }),
        prisma.user.count({ where }),
    ]);
    return {
        users,
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / take),
    };
});
exports.getUsersService = getUsersService;
