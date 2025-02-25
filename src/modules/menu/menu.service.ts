import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { messages } from 'src/common/constant';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    try {
     const data = await this.prisma.menu.create({
        data: createMenuDto,
      });
      return {
        statusCode: 201,
        success: true,
        message: messages.CREATE_SUCCESS,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getMenus() {
    try {
      const menus = await this.prisma.menu.findMany({
        where: {
          parentId: null,
        },
      });
      return {
        statusCode: 200,
        success: true,
        data: menus,
      };
    } catch (error) {
      throw error;
    }
  }

  private buildMenuTree(menus: any[], parentId: string | null) {
    return menus
      .filter((menu) => menu.parentId === parentId)
      .map((menu) => ({
        ...menu,
        subMenu: this.buildMenuTree(menus, menu.id),
      }));
  }

  private buildMenuTreeBy(menus: any[], parentId: string | null) {
    return menus
      .filter((menu) => menu.id === parentId)
      .map((menu) => ({
        ...menu,
        subMenu: this.buildMenuTree(menus, menu.id),
      }));
  }
  async getMenuById(id: string) {
    try {
      const menus = await this.prisma.menu.findMany();
      return {
        statusCode: 200,
        success: true,
        data: this.buildMenuTreeBy(menus, id),
      };
    } catch (error) {
      throw error;
    }
  }
  async getMenuByParentId(id: string) {
    try {
      const menus = await this.prisma.menu.findUnique({
        where: { id },
        include: { subMenu: true },
      });
      return {
        statusCode: 200,
        success: true,
        data: menus,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMenuSubById(id: string) {
    try {
      const menus = await this.prisma.menu.findUnique({
        where: { id },
        include: {
          subMenu: {
            include: {
              subMenu: {
                include: {
                  subMenu: true, // Keep nesting as deep as required
                },
              },
            },
          },
        },
      });
      return {
        statusCode: 200,
        success: true,
        data: menus?.subMenu,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteMenu(id: string) {
    try {
      await this.prisma.menu.delete({ where: { id } });
      return {
        statusCode: 200,
        success: true,
        message: messages.DELETE_SUCCESS,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException({
          success: false,
          message: messages.NOT_FOUND,
          statusCode: 404,
        });
      }

      throw new InternalServerErrorException({
        statusCode: 500,
        message: messages.DELETE_INTERNAL_SERVER_ERROR,
      });
    }
  }
  async updateMenu(id: string, updateMenuDto: UpdateMenuDto) {
    try {
      await this.prisma.menu.update({
        where: {
          id,
        },
        data: updateMenuDto,
      });
      return {
        statusCode: 200,
        success: true,
        message: messages.UPDATE_SUCCESS,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: messages.UPDATE_INTERNAL_SERVER_ERROR,
      });
    }
  }
}
