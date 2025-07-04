"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataUri = exports.multipleupload = exports.singleupload = void 0;
const multer_1 = __importDefault(require("multer"));
const parser_js_1 = __importDefault(require("datauri/parser.js"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
exports.singleupload = (0, multer_1.default)({ storage }).single("file");
// export const multipleupload = multer({storage}).fields([
//     {name: "outside_view_images"},
//     {name: "living_room_images"},
//     {name: "kitchen_room_images"},
//     {name: "floor_plan_images"},
//     {name: "virtual_tour_images"},
//     {name: "other_images"},
//     {name: "banner", maxCount: 1},
//     {name: "youTube_thumbnail", maxCount: 1},
//     {name: "avatar", maxCount: 1}
// ]);
exports.multipleupload = (0, multer_1.default)({ storage }).fields([
    { name: "outside_view_images", },
    { name: "living_room_images", },
    { name: "kitchen_room_images", },
    { name: "primary_room_images", },
    { name: "floor_plan_images", },
    { name: "tour_3d_images", },
    { name: "other_images", },
    { name: "banner", },
    { name: "youTube_thumbnail", }
]);
const getDataUri = (file) => {
    const parser = new parser_js_1.default();
    const extName = path_1.default.extname(file.originalname).toString();
    const result = parser.format(extName, file.buffer);
    if (!result.content) {
        throw new Error('Failed to generate data URI');
    }
    return { content: result.content };
};
exports.getDataUri = getDataUri;
