"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const posts_service_1 = require("./posts.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_post_dto_1 = require("./dto/create.post.dto");
const posts_model_1 = require("./posts.model");
let PostsController = class PostsController {
    constructor(postService) {
        this.postService = postService;
    }
    async create(post, request) {
        return this.postService.createPost(post, request);
    }
    async findAll() {
        return this.postService.findAllPosts();
    }
    async findById(id) {
        return this.postService.findPostById(id);
    }
    async update(post, request, id) {
        return this.postService.updatePost(post, id, request);
    }
    async delete(id, request) {
        return this.postService.deletePost(id, request);
    }
    async setBan(id, request) {
        return this.postService.verifyPost(id, request);
    }
    async favorite(id, request) {
        return this.postService.favoritePost(id, request);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get All Post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [posts_model_1.Posts] }),
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, common_1.Get)('/find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet user (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/verify/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "setBan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Favorite post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: posts_model_1.Posts }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/fav/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "favorite", null);
PostsController = __decorate([
    (0, swagger_1.ApiTags)('Post'),
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
exports.PostsController = PostsController;
//# sourceMappingURL=posts.controller.js.map